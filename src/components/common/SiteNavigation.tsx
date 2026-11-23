"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, ChevronDown, Plus } from "lucide-react";
import LocalizedLink from "../LocalizedLink";
import type { Locale, Messages } from "@/lib/i18n";
import type { CityNavItem } from "./MegaMenu";
import { navigationCopy } from "./navigation-copy";
import { PLATFORM_PAGES } from "@/lib/platform/pages";
import { RESEARCH_NAV, RESEARCH_NAV_HREF } from "@/lib/research/nav";
import styles from "./Header.module.css";

type NavigationEntry = { label: string; href: string; children?: { label: string; detail?: string; href: string }[] };
type NavigationProps = { translations: Messages; cities: CityNavItem[]; locale: Locale };

/**
 * How many entries sit on the bar; the rest open from "Explore". Five fit at
 * every desktop width, including 1100px, where the bar is narrowest before
 * the mobile menu takes over.
 */
const PRIMARY_COUNT = 5;

function getEntries(t: Messages, cities: CityNavItem[], locale: Locale): NavigationEntry[] {
  const c = navigationCopy[locale];
  return [
    // First on purpose: Factory Graph is the product the site now leads with.
    // Page names are product names and stay in English in every locale.
    { label: c.platform, href: "/factory-graph", children: PLATFORM_PAGES.map(page => ({label:page.nav,detail:page.navDetail,href:`/${page.path}`})) },
    { label: t.nav.services, href: "/services", children: t.services.items.map(item => ({label:item.name,detail:item.kicker,href:`/services#${item.id}`})) },
    { label: t.nav.work, href: "/case-studies", children: t.caseStudies.items.slice(0,8).map(item => ({label:item.industry,detail:item.location,href:`/case-studies#${item.id}`})) },
    { label: c.pricing, href: "/pricing" },
    { label: t.nav.about, href: "/about" },
    { label: t.nav.industries, href: "/industries", children: ["manufacturing","real-estate","healthcare","ecommerce","edtech"].flatMap(slug => {const item=t.industries.items.find(industry=>industry.id===slug);return item?[{label:item.name,detail:item.tag,href:`/industries/${slug}`}]:[];}) },
    { label: c.insights, href: "/blogs" },
    // Report titles are English, like the reports themselves (lib/research).
    { label: c.research, href: RESEARCH_NAV_HREF, children: RESEARCH_NAV.map(item => ({label:item.label,detail:item.detail,href:`${RESEARCH_NAV_HREF}/${item.slug}`})) },
    { label: c.newsroom, href: "/newsroom" },
    { label: c.cities, href: "/cities", children: cities.map(city => ({label:city.name,detail:city.state,href:`/cities/${city.slug}`})) },
    { label: t.nav.contact, href: "/contact" },
  ];
}

function activePath(pathname: string, href: string) {
  const path = "/" + pathname.split("/").slice(3).join("/");
  return path === href || path.startsWith(href + "/");
}

/** A top-level entry is current on its own page and on any page listed under it (anchors excluded). */
function entryActive(pathname: string, entry: NavigationEntry) {
  return activePath(pathname, entry.href) || !!entry.children?.some(child => !child.href.includes("#") && activePath(pathname, child.href));
}

export function DesktopNavigation({ translations: t, cities, locale }: NavigationProps) {
  const entries = getEntries(t,cities,locale);
  const c = navigationCopy[locale];
  const [active, setActive] = useState<number | "explore" | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const triggers = useRef<Record<string,HTMLButtonElement | null>>({});
  const pendingFocus = useRef(false);
  const returnTrigger = useRef<string>("explore");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();
  const pathname = usePathname();
  function clearTimer() { if(closeTimer.current) clearTimeout(closeTimer.current); }
  function show(value: number | "explore") { clearTimer(); if(value === "explore" || value < PRIMARY_COUNT) returnTrigger.current=String(value); setActive(value); }
  function close() { clearTimer(); setActive(null); }
  function openWithFocus(value: number | "explore") {
    if(active === value) panel.current?.querySelector<HTMLElement>("a,button")?.focus();
    else { pendingFocus.current=true; show(value); }
  }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if(event.key === "Escape" && active !== null) { event.preventDefault(); event.stopPropagation(); triggers.current[returnTrigger.current]?.focus(); close(); }
  }
  useEffect(() => { if(active!==null&&pendingFocus.current){panel.current?.querySelector<HTMLElement>("a,button")?.focus();pendingFocus.current=false;} }, [active]);
  useEffect(() => { setActive(null); }, [pathname]);
  useEffect(() => {
    const outside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setActive(null);};
    const breakpoint=matchMedia("(min-width: 1100px)");
    const resize=()=>{if(!breakpoint.matches)setActive(null);};
    document.addEventListener("pointerdown",outside);breakpoint.addEventListener("change",resize);
    return()=>{document.removeEventListener("pointerdown",outside);breakpoint.removeEventListener("change",resize);if(closeTimer.current)clearTimeout(closeTimer.current);};
  }, []);
  const selected = typeof active === "number" ? entries[active] : null;
  return <div className={styles.desktopNavigation} ref={root} onKeyDown={onKeyDown} onPointerEnter={clearTimer} onPointerLeave={() => {clearTimer();closeTimer.current=setTimeout(()=>{if(!panel.current?.contains(document.activeElement))setActive(null);},200);}} onBlur={event=>{if(event.relatedTarget&&!event.currentTarget.contains(event.relatedTarget as Node))close();}}>
    <nav className={styles.primaryNav} aria-label={c.navigation}>{entries.slice(0,PRIMARY_COUNT).map((entry,i)=><div key={entry.href} className={styles.navGroup} data-active={entryActive(pathname,entry)}>
      <LocalizedLink href={entry.href} onPointerEnter={event=>{if(event.pointerType==="mouse"){if(entry.children)show(i);else close();}}} aria-current={activePath(pathname,entry.href)?"page":undefined} onClick={close}>{entry.label}</LocalizedLink>
      {entry.children&&<button type="button" ref={node=>{triggers.current[i]=node;}} aria-label={`${c.explore}: ${entry.label}`} aria-expanded={active===i} aria-controls={`${id}-panel`} onClick={()=>active===i?close():show(i)} onKeyDown={event=>{if(event.key==="ArrowDown"){event.preventDefault();openWithFocus(i);}}}><ChevronDown size={12} aria-hidden="true"/></button>}
    </div>)}<button type="button" className={styles.exploreTrigger} ref={node=>{triggers.current.explore=node;}} aria-expanded={active==="explore"} aria-controls={`${id}-panel`} onClick={()=>active==="explore"?close():show("explore")} onKeyDown={event=>{if(event.key==="ArrowDown"){event.preventDefault();openWithFocus("explore");}}}>{c.explore}<Plus size={13} aria-hidden="true"/></button></nav>
    <div id={`${id}-panel`} ref={panel} hidden={active===null} className={styles.megaPanel} role="region" aria-label={selected?.label??c.browse}>
      <div className={styles.panelInner}>
        {selected ? <><div className={styles.panelIntro}><span className={styles.index}>0{Number(active)+1} / {c.overview}</span><h2>{selected.label}<span aria-hidden="true">.</span></h2><LocalizedLink href={selected.href} onClick={close}>{c.more}<ArrowRight size={15} aria-hidden="true"/></LocalizedLink><div className={styles.miniSystem} aria-hidden="true"><span/><i/><span/><i/><span/></div></div><div className={styles.panelLinks}>{selected.children?.map((entry,i)=><LocalizedLink key={entry.href} href={entry.href} onClick={close}><span className={styles.index}>{String(i+1).padStart(2,"0")}</span><span><strong>{entry.label}</strong>{entry.detail&&<small>{entry.detail}</small>}</span><ArrowUpRight size={15} aria-hidden="true"/></LocalizedLink>)}</div></> : <><div className={styles.panelIntro}><span className={styles.index}>{c.browse}</span><h2>{t.brand.name}<span aria-hidden="true">.</span></h2><p>{c.tagline}</p><LocalizedLink href="/contact" onClick={close}>{t.nav.contact}<ArrowUpRight size={15} aria-hidden="true"/></LocalizedLink></div><div className={styles.exploreColumns}>
          <div><span className={styles.index}>{c.explore}</span>{entries.slice(PRIMARY_COUNT).map((entry,i)=><div key={entry.href} className={styles.exploreRow}><LocalizedLink href={entry.href} onClick={close}>{entry.label}<ArrowUpRight size={15} aria-hidden="true"/></LocalizedLink>{entry.children&&<button type="button" onClick={()=>openWithFocus(i+PRIMARY_COUNT)} aria-label={`${c.explore}: ${entry.label}`}><Plus size={16} aria-hidden="true"/></button>}</div>)}</div>
          <div><LocalizedLink href="/cities" className={styles.cityDirectory} onClick={close}>{c.cities}<span className={styles.index}>{String(cities.length).padStart(2,"0")}</span></LocalizedLink><div className={styles.cityLinks}>{cities.map(city=><LocalizedLink key={city.slug} href={`/cities/${city.slug}`} onClick={close}>{city.name}<ArrowUpRight size={11} aria-hidden="true"/></LocalizedLink>)}</div></div>
        </div></>}
      </div>
      <div className={styles.panelFooter}><span>{c.tagline}</span><button type="button" onClick={()=>{if(active!==null)triggers.current[returnTrigger.current]?.focus();close();}}>{c.close}<span className={styles.index}>ESC</span></button></div>
    </div>
  </div>;
}

export function MobileNavigation({ translations: t, cities, locale, onNavigate }: NavigationProps & { onNavigate: () => void }) {
  const entries=getEntries(t,cities,locale);
  const [expanded,setExpanded]=useState<number|null>(null);
  const c=navigationCopy[locale];
  const pathname=usePathname();
  const id=useId();
  return <nav className={styles.mobileNav} aria-label={c.navigation}><span className={styles.mobileEyebrow}>{c.browse}</span>{entries.map((entry,i)=><div key={entry.href} className={styles.mobileNavGroup}>
    <div className={styles.mobileNavRow}><span className={styles.index}>{String(i+1).padStart(2,"0")}</span><LocalizedLink href={entry.href} onClick={onNavigate} aria-current={activePath(pathname,entry.href)?"page":undefined}>{entry.label}</LocalizedLink>{entry.children?<button type="button" aria-label={`${c.explore}: ${entry.label}`} aria-expanded={expanded===i} aria-controls={`${id}-${i}`} onClick={()=>setExpanded(value=>value===i?null:i)}><Plus size={19} aria-hidden="true"/></button>:<ArrowUpRight size={18} aria-hidden="true"/>}</div>
    {entry.children&&<div id={`${id}-${i}`} className={styles.mobileSubnav} hidden={expanded!==i}>{entry.children.map(child=><LocalizedLink key={child.href} href={child.href} onClick={onNavigate}><span><strong>{child.label}</strong>{child.detail&&<small>{child.detail}</small>}</span><ArrowUpRight size={14} aria-hidden="true"/></LocalizedLink>)}</div>}
  </div>)}</nav>;
}
