import React from "react";
import type { Author } from "@/types";

interface SeoHeadProps {
  title?:       string;
  description?: string;
  url?:         string;
  image?:       string;
  author?:      Author;
  type?:        "website" | "article";
  publishedAt?: string;
}

const SITE_NAME = "Alex Rivera — Portfolio";
const SITE_URL  = "https://alexrivera.dev"; // TODO: Update with your domain

export default function SeoHead({
  title       = "Alex Rivera — Full-Stack Engineer & Designer",
  description = "Full-stack engineer crafting high-performance web experiences with React, Next.js, animations, and 3D.",
  url         = SITE_URL,
  image       = `${SITE_URL}/og-image.jpg`,
  author,
  type        = "website",
  publishedAt,
}: SeoHeadProps) {
  // JSON-LD structured data for Person
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name:          author?.name ?? "Alex Rivera",
    url:           SITE_URL,
    image:         `${SITE_URL}/images/avatar.jpg`,
    sameAs:        [
      author?.social?.github  ?? "https://github.com",
      author?.social?.twitter ?? "https://twitter.com",
      author?.social?.linkedin ?? "https://linkedin.com",
    ],
    jobTitle: "Full-Stack Engineer & Designer",
    description,
  };

  // JSON-LD for article pages
  const articleSchema = type === "article" ? {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    image,
    datePublished: publishedAt,
    author: {
      "@type": "Person",
      name: author?.name ?? "Alex Rivera",
    },
  } : null;

  return (
    <>
      {/* Primary meta */}
      <meta name="description" content={description} />
      <meta name="author" content={author?.name ?? "Alex Rivera"} />

      {/* Open Graph */}
      <meta property="og:type"        content={type} />
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:title"       content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url"         content={url} />
      <meta property="og:image"       content={image} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={image} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
    </>
  );
}
