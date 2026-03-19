// ─── Project ──────────────────────────────────────────────────────────────────
export interface Project {
  slug: string;
  title: string;
  blurb: string;
  description: string;
  coverImage: string;
  tags: string[];
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
  year: number;
}

// ─── Blog Post ────────────────────────────────────────────────────────────────
export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  publishedAt: string;
  author: Author;
  tags: string[];
  readingTime: number; // minutes
}

// ─── Author ───────────────────────────────────────────────────────────────────
export interface Author {
  name: string;
  bio: string;
  avatar: string;
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

// ─── About section ────────────────────────────────────────────────────────────
export interface AboutContent {
  headline: string;
  bio: string;
  skills: SkillGroup[];
  resume?: string; // URL to PDF
}

export interface SkillGroup {
  category: string;
  items: string[];
}

// ─── CMS aggregated content ───────────────────────────────────────────────────
export interface CMSContent {
  projects: Project[];
  posts: Post[];
  about: AboutContent;
  author: Author;
}

// ─── Contact form ─────────────────────────────────────────────────────────────
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ─── API responses ────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
export interface NavLink {
  label: string;
  href: string;
}
