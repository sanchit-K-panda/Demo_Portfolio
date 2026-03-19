/**
 * CMS Adapter — abstracts fetch logic.
 * Uses Sanity when NEXT_PUBLIC_SANITY_PROJECT_ID is set,
 * otherwise falls back to /data/content.json.
 */
import type { Project, Post, AboutContent, Author, CMSContent } from "@/types";

// ─── Fallback: load local mock data ─────────────────────────────────────────
async function loadLocalContent(): Promise<CMSContent> {
  // Dynamic import so this only runs server-side in Node
  const data = await import("@/data/content.json");
  return data.default as CMSContent;
}

// ─── Sanity: lazy-load client only when env vars are present ─────────────────
async function getSanityClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

  if (!projectId) return null;

  // TODO: Add `@sanity/client` to deps if using Sanity
  const { createClient } = await import("@sanity/client");
  return createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: process.env.NODE_ENV === "production",
    // SANITY_API_TOKEN only needed for authenticated queries (drafts, mutations)
    token: process.env.SANITY_API_TOKEN,
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  const client = await getSanityClient();

  if (client) {
    // TODO: refine Sanity GROQ query to match your schema
    return client.fetch<Project[]>(
      `*[_type == "project"] | order(year desc) {
        "slug": slug.current,
        title,
        blurb,
        description,
        "coverImage": coverImage.asset->url,
        tags,
        demoUrl,
        repoUrl,
        featured,
        year
      }`
    );
  }

  const content = await loadLocalContent();
  return content.projects;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
}

export async function getPosts(): Promise<Post[]> {
  const client = await getSanityClient();

  if (client) {
    return client.fetch<Post[]>(
      `*[_type == "post"] | order(publishedAt desc) {
        "slug": slug.current,
        title,
        excerpt,
        body,
        "coverImage": coverImage.asset->url,
        publishedAt,
        author->{ name, bio, "avatar": avatar.asset->url, social },
        tags,
        readingTime
      }`
    );
  }

  const content = await loadLocalContent();
  return content.posts;
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug);
}

export async function getAbout(): Promise<AboutContent> {
  const client = await getSanityClient();

  if (client) {
    return client.fetch<AboutContent>(
      `*[_type == "about"][0] {
        headline,
        bio,
        skills,
        "resume": resume.asset->url
      }`
    );
  }

  const content = await loadLocalContent();
  return content.about;
}

export async function getAuthor(): Promise<Author> {
  const content = await loadLocalContent();
  return content.author;
}
