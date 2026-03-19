/**
 * Tests for ProjectCard component.
 * Verifies renders, accessibility, and content.
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProjectCard from "@/components/cards/ProjectCard";
import type { Project } from "@/types";

// Mock Next.js Image and Link to avoid SSR complexity in tests
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, ...rest }: { alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...rest} />
  ),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    article: ({ children, ...rest }: { children: React.ReactNode; [key: string]: unknown }) => (
      <article {...rest}>{children}</article>
    ),
    div: ({ children, ...rest }: { children: React.ReactNode; [key: string]: unknown }) => (
      <div {...rest}>{children}</div>
    ),
  },
}));

const mockProject: Project = {
  slug:        "test-project",
  title:       "Test Project",
  blurb:       "A test project description.",
  description: "Full description of the test project.",
  coverImage:  "/images/test.jpg",
  tags:        ["React", "TypeScript", "Next.js"],
  demoUrl:     "https://example.com",
  repoUrl:     "https://github.com/test",
  featured:    true,
  year:        2024,
};

describe("ProjectCard", () => {
  it("renders project title", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });

  it("renders project blurb", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("A test project description.")).toBeInTheDocument();
  });

  it("renders all tags", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  it("renders Featured badge when project.featured is true", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("does NOT render Featured badge when project.featured is false", () => {
    render(<ProjectCard project={{ ...mockProject, featured: false }} />);
    expect(screen.queryByText("Featured")).not.toBeInTheDocument();
  });

  it("renders a link with correct href", () => {
    const { container } = render(<ProjectCard project={mockProject} />);
    // The main link wraps the entire card content
    const link = container.querySelector('a[href="/projects/test-project"]');
    expect(link).toBeInTheDocument();
  });

  it("renders demo and repo links", () => {
    const { container } = render(<ProjectCard project={mockProject} />);
    expect(container.querySelector('a[href="https://example.com"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="https://github.com/test"]')).toBeInTheDocument();
  });

  it("has accessible article role and aria-label", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByRole("article", { name: /Project: Test Project/i })).toBeInTheDocument();
  });

  it("renders the cover image with alt text", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByAltText("Cover image for Test Project")).toBeInTheDocument();
  });
});
