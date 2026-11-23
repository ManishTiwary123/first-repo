-- Lead capture (website enquiries).
--
-- Run once in the Supabase SQL editor as the project owner. Safe to re-run.
-- NOTHING in the repository runs this for you: it changes a production
-- database, so a person applies it deliberately.
--
-- What it creates
--   public.leads               one row per enquiry
--   public.lead_tasks          the follow-up task created with each enquiry
--   public.submit_lead(jsonb)  the ONLY way the website writes to either table
--   role lead_writer           the website's login for leads: EXECUTE on that
--                              function and nothing else
--
-- After running it
--   1. Enable the login: alter role lead_writer with login password '<long random>';
--   2. Put the transaction-pooler connection string for that role in the
--      site's environment as LEADS_DATABASE_URL (see .env.example).
--   3. Submit the form once and check:  select * from public.leads;
--
-- Reading leads: use the Supabase dashboard, your CRM sync, or the admin
-- connection. The website itself cannot read a lead back.

create table if not exists public.leads (
  id                uuid        primary key default gen_random_uuid(),
  reference         text        not null unique,
  idempotency_key   text        not null unique,
  created_at        timestamptz not null default now(),

  -- Worked by a person or a CRM sync; the website only ever inserts 'new'.
  status            text        not null default 'new'
                    check (status in ('new', 'contacted', 'qualified', 'won', 'lost', 'spam')),

  name              text        not null check (char_length(name) between 2 and 100),
  email             text        not null check (char_length(email) <= 254 and position('@' in email) > 1),
  phone             text                 check (phone is null or char_length(phone) <= 32),
  company           text        not null check (char_length(company) between 2 and 120),
  role              text        not null check (char_length(role) between 2 and 100),
  country           text        not null check (char_length(country) between 2 and 80),
  industry          text        not null check (char_length(industry) between 2 and 80),

  scale             text                 check (scale is null or scale in ('1-10', '11-50', '51-200', '200+', 'no-machines')),
  erp_crm           text                 check (erp_crm is null or char_length(erp_crm) <= 200),
  cad_cam           text                 check (cad_cam is null or char_length(cad_cam) <= 200),
  connectivity      text                 check (connectivity is null or connectivity in ('none', 'partial', 'connected', 'unsure', 'not-applicable')),

  challenge         text        not null check (char_length(challenge) between 10 and 2000),
  service           text        not null check (service in (
                      'factory-graph', 'iiot-digital-twin', 'erp-integration', 'crm-ai-agents',
                      'cad-cam-cnc', 'process-automation', 'custom-software', 'systems-audit', 'not-sure', 'other')),

  category          text        not null check (category in ('industrial', 'business-systems', 'audit', 'general')),
  priority          text        not null check (priority in ('A', 'B', 'C')),
  score             integer     not null check (score between 0 and 50),
  email_kind        text        not null check (email_kind in ('work', 'free')),

  -- Consent is recorded with the exact wording the visitor saw. Marketing
  -- messages may be sent only where consent_marketing is true.
  consent_contact   boolean     not null check (consent_contact),
  consent_marketing boolean     not null default false,
  consent_text      text        not null,
  consent_version   text        not null,
  consent_at        timestamptz not null,

  -- The first enquiry from the same email in the last 30 days, if any.
  duplicate_of      uuid        references public.leads (id) on delete set null,

  -- form_id, page_path, locale, market, landing page, referrer, UTM, click ids
  source            jsonb       not null default '{}'::jsonb,
  -- salted ip hash (or null), user agent, geo country
  client            jsonb       not null default '{}'::jsonb
);

create index if not exists leads_email_created_idx on public.leads (lower(email), created_at desc);
create index if not exists leads_status_created_idx on public.leads (status, created_at desc);

create table if not exists public.lead_tasks (
  id          uuid        primary key default gen_random_uuid(),
  lead_id     uuid        not null references public.leads (id) on delete cascade,
  kind        text        not null check (kind in ('follow_up', 'repeat_enquiry')),
  title       text        not null,
  due_on      date        not null,
  status      text        not null default 'open' check (status in ('open', 'done', 'cancelled')),
  created_at  timestamptz not null default now(),
  -- The enquiry that caused this task (differs from lead_id for a repeat).
  source_lead uuid        references public.leads (id) on delete set null
);

create index if not exists lead_tasks_open_idx on public.lead_tasks (status, due_on);

-- RLS on, with no policies: the Supabase REST API (anon / authenticated keys)
-- can neither read nor write these tables. The function below runs as its
-- owner and is the only path in.
alter table public.leads enable row level security;
alter table public.lead_tasks enable row level security;

-- ---------------------------------------------------------------------------
-- submit_lead: validate again, de-duplicate, insert, create the task.
--
-- Returns one row: (id, reference, duplicate, replay)
--   replay    = this idempotency key was stored before; nothing was written.
--   duplicate = the same email enquired within 30 days; the new row points at
--               the earlier one and the task is attached to that earlier lead.
--
-- The website validates every field before calling this. The table's CHECK
-- constraints repeat the same limits, so a caller holding the lead_writer
-- password still cannot store anything the form would have refused.
-- ---------------------------------------------------------------------------
create or replace function public.submit_lead(p jsonb)
returns table (id uuid, reference text, duplicate boolean, replay boolean)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_key       text := p ->> 'idempotencyKey';
  v_email     text := lower(p ->> 'email');
  v_existing  public.leads%rowtype;
  v_first     uuid;
  v_id        uuid;
  v_reference text := p ->> 'reference';
begin
  if v_key is null or v_key !~ '^[A-Za-z0-9_-]{16,64}$' then
    raise exception 'submit_lead: invalid idempotency key' using errcode = '22023';
  end if;
  if v_reference is null or v_reference !~ '^SG-[0-9A-Z]{4}-[0-9A-Z]{4}$' then
    raise exception 'submit_lead: invalid reference' using errcode = '22023';
  end if;
  if coalesce((p -> 'consent' ->> 'contact')::boolean, false) is not true then
    raise exception 'submit_lead: consent is required' using errcode = '22023';
  end if;

  -- A retry of a submission that already landed.
  select * into v_existing from public.leads l where l.idempotency_key = v_key;
  if found then
    return query select v_existing.id, v_existing.reference, v_existing.duplicate_of is not null, true;
    return;
  end if;

  -- The earliest live enquiry from this address in the last 30 days.
  select l.id into v_first
  from public.leads l
  where lower(l.email) = v_email
    and l.created_at > now() - interval '30 days'
    and l.status <> 'spam'
  order by l.created_at asc
  limit 1;

  begin
    insert into public.leads (
      reference, idempotency_key, name, email, phone, company, role, country, industry,
      scale, erp_crm, cad_cam, connectivity, challenge, service,
      category, priority, score, email_kind,
      consent_contact, consent_marketing, consent_text, consent_version, consent_at,
      duplicate_of, source, client
    ) values (
      v_reference, v_key,
      p ->> 'name', v_email, nullif(p ->> 'phone', ''), p ->> 'company', p ->> 'role',
      p ->> 'country', p ->> 'industry',
      nullif(p ->> 'scale', ''), nullif(p ->> 'erpCrm', ''), nullif(p ->> 'cadCam', ''),
      nullif(p ->> 'connectivity', ''), p ->> 'challenge', p ->> 'service',
      p ->> 'category', p ->> 'priority', (p ->> 'score')::integer, p ->> 'emailKind',
      true, coalesce((p -> 'consent' ->> 'marketing')::boolean, false),
      p -> 'consent' ->> 'text', p -> 'consent' ->> 'version', (p -> 'consent' ->> 'at')::timestamptz,
      v_first, coalesce(p -> 'source', '{}'::jsonb), coalesce(p -> 'client', '{}'::jsonb)
    )
    returning leads.id into v_id;
  exception when unique_violation then
    -- Two requests with the same key raced; the other one won.
    select * into v_existing from public.leads l where l.idempotency_key = v_key;
    if found then
      return query select v_existing.id, v_existing.reference, v_existing.duplicate_of is not null, true;
      return;
    end if;
    raise;
  end;

  insert into public.lead_tasks (lead_id, kind, title, due_on, source_lead)
  values (
    coalesce(v_first, v_id),
    case when v_first is null then 'follow_up' else 'repeat_enquiry' end,
    left(coalesce(p -> 'followUp' ->> 'title', 'Reply to website enquiry'), 300),
    coalesce((p -> 'followUp' ->> 'dueOn')::date, (now() at time zone 'Asia/Kolkata')::date + 1),
    v_id
  );

  return query select v_id, v_reference, v_first is not null, false;
end;
$$;

-- ---------------------------------------------------------------------------
-- Least privilege: lead_writer can call the function and nothing else.
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'lead_writer') then
    -- NOLOGIN until a password is set (step 1 at the top of this file).
    create role lead_writer nologin;
  end if;
end
$$;

revoke all on function public.submit_lead(jsonb) from public;
do $$
begin
  -- Supabase's API roles; absent on a plain Postgres.
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function public.submit_lead(jsonb) from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on function public.submit_lead(jsonb) from authenticated;
  end if;
end
$$;

revoke all on public.leads from lead_writer;
revoke all on public.lead_tasks from lead_writer;
grant usage on schema public to lead_writer;
grant execute on function public.submit_lead(jsonb) to lead_writer;

-- To enable the login once you have chosen a password:
--   alter role lead_writer with login password '<long random string>';
