import type { Metadata } from "next";
import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPosts, getPostBySlug } from "@/lib/cms";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title:       post.title,
    description: post.excerpt,
    openGraph:   {
      type:            "article",
      publishedTime:   post.publishedAt,
      authors:         [post.author.name],
      images:          [{ url: post.coverImage }],
    },
  };
}

export const revalidate = 3600;

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article className="min-h-screen bg-surface pt-24" aria-label={post.title}>
      {/* Cover */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden">
        <Image
          src={post.coverImage}
          alt={`Cover image for ${post.title}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" aria-hidden="true" />
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
        <Link href="/blog" className="text-sm text-slate-500 hover:text-brand-400 transition-colors mb-8 inline-block">
          ← Back to Blog
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="tag-pill">{tag}</span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min read</span>
            <span aria-hidden="true">·</span>
            <span>by {post.author.name}</span>
          </div>
        </header>

        {/* Body */}
        <div className="prose prose-invert prose-slate max-w-none">
          {post.body.split("\n\n").map((block, i) => {
            if (block.startsWith("## ")) {
              return (
                <h2 key={i} className="text-2xl font-bold text-white mt-10 mb-4">
                  {block.replace("## ", "")}
                </h2>
              );
            }
            return (
              <p key={i} className="text-slate-400 leading-relaxed mb-4">
                {block}
              </p>
            );
          })}
        </div>

        {/* Author card */}
        <footer className="mt-12 pt-8 border-t border-surface-border flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-white">{post.author.name}</p>
            <p className="text-sm text-slate-400">{post.author.bio}</p>
          </div>
        </footer>
      </div>
    </article>
  );
}
