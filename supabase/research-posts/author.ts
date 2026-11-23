/**
 * Byline for the research-desk posts. Change it here once a named person
 * reviews and signs these articles; every research post reads it.
 */
import type { BlogPost } from "../../src/lib/blogs.ts";

export const RESEARCH_AUTHOR: BlogPost["author"] = {
  name: "Savin Group Research",
  role: "Research desk, Savin Group",
  bio: "Reads vendor documentation, release notes, standards and public benchmarks so manufacturers and brands can see what software and AI agents actually do, with every figure linked to its source.",
};

/** Publication date of the first research-desk batch. */
export const RESEARCH_PUBLISHED = "2026-11-23";
