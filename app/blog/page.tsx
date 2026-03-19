import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getPosts } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on frontend engineering, animations, 3D, and design.",
};

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-surface pt-28 section-padding">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16">
          <p className="text-brand-400 text-sm font-semibold tracking-widest uppercase mb-3">
            Writing
          </p>
          <h1 className="section-title text-white mb-4">
            The <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-slate-400 max-w-xl">
            Deep-dives on frontend engineering, animation, 3D, and developer experience.
          </p>
        </header>

        <section aria-label="Blog posts list">
          <ul className="flex flex-col gap-8 list-none" role="list">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group glass-card flex flex-col md:flex-row gap-6 p-6 hover:border-brand-700/50 transition-colors"
                  aria-label={`Read: ${post.title}`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-full md:w-48 h-36 shrink-0 rounded-xl overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={`Cover for ${post.title}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 192px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Meta */}
                  <div className="flex flex-col justify-center gap-2">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag-pill">{tag}</span>
                      ))}
                    </div>
                    <h2 className="text-lg font-semibold text-white group-hover:text-brand-300 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-slate-400 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "long", day: "numeric",
                        })}
                      </time>
                      <span>·</span>
                      <span>{post.readingTime} min read</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
