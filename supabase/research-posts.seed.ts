/**
 * Research-desk blog posts: the spoke articles of the Research library
 * (/research). Each file under research-posts/ holds the posts written from
 * one report in src/lib/research/reports/.
 *
 * Used only to generate supabase/research-seed.sql:
 *
 *   node supabase/generate-research-seed.ts
 *
 * Kept apart from blog-posts.seed.ts so running the research SQL can never
 * overwrite dashboard edits to the original posts.
 */
import type { BlogPost } from "../src/lib/blogs.ts";
import { FACTORY_GRAPH_POSTS } from "./research-posts/factory-graph.ts";
import { MANUFACTURING_SOFTWARE_POSTS } from "./research-posts/manufacturing-software.ts";
import { FUTURE_ERP_CRM_POSTS } from "./research-posts/future-erp-crm.ts";
import { AGENT_ORCHESTRATION_POSTS } from "./research-posts/agent-orchestration.ts";
import { HUB_EMBEDDING_POSTS } from "./research-posts/hub-embedding.ts";
import { BACK_OFFICE_POSTS } from "./research-posts/back-office.ts";
import { COMMERCE_MARKETING_POSTS } from "./research-posts/commerce-marketing.ts";

export const RESEARCH_POSTS: BlogPost[] = [
  ...MANUFACTURING_SOFTWARE_POSTS,
  ...FACTORY_GRAPH_POSTS,
  ...FUTURE_ERP_CRM_POSTS,
  ...AGENT_ORCHESTRATION_POSTS,
  ...HUB_EMBEDDING_POSTS,
  ...BACK_OFFICE_POSTS,
  ...COMMERCE_MARKETING_POSTS,
];

/**
 * sort_order of the first research post. The original posts use 0..n in
 * file order; starting well above them keeps the two sets from interleaving
 * in list order and prev/next navigation.
 */
export const RESEARCH_SORT_START = 100;
