# Demo Portfolio

A production-ready, animation-heavy portfolio website built with **Next.js 14**, **TypeScript**, **GSAP**, **Framer Motion**, **Three.js**, **Lenis**, and **Tailwind CSS**.

---

## ✨ Features

- **Three.js interactive hero** — rotating icosahedron with mouse parallax
- **GSAP + ScrollTrigger** — section-reveal and stagger animations
- **Framer Motion** — micro-interactions, hover effects, and page transitions
- **Lenis** — buttery-smooth inertia scrolling, synced with GSAP ScrollTrigger
- **Lottie** — animated SVG/JSON icons with SVG fallback
- **Radix UI** — accessible dropdown, dialog, and navigation primitives
- **React Hook Form + Zod** — fully validated contact form
- **Sanity CMS scaffold** — with local JSON fallback when CMS env vars are absent
- **Next.js App Router** — SSG/ISR for all pages, typed with TypeScript
- **Tailwind CSS** — utility-first styling with custom dark theme
- **styled-components** — themed `Button` component
- **SEO** — OpenGraph, Twitter card, JSON-LD Person schema
- **GitHub Actions CI** — lint + test + build on every push/PR
- **Lighthouse-ready** — prefetch, `next/image`, minimal main-thread work

---

## 🗂 Project Structure

```
Demo_Portfolio/
├── app/                    # Next.js App Router pages & API routes
│   ├── layout.tsx          # Root layout (Lenis + Navbar + Footer)
│   ├── page.tsx            # Home page
│   ├── projects/           # Projects listing + [slug] detail (SSG)
│   ├── blog/               # Blog listing + [slug] detail (SSG)
│   └── api/contact/        # Contact form API route
├── components/
│   ├── ui/                 # Button (styled-components), Tag
│   ├── layout/             # Navbar (Radix UI), Footer
│   ├── hero/               # ThreeScene (Three.js), HeroSection (GSAP)
│   ├── sections/           # Projects, About, Contact sections
│   ├── cards/              # ProjectCard (Framer Motion)
│   ├── lottie/             # LottiePlayer with fallback
│   ├── seo/                # SeoHead (OpenGraph + JSON-LD)
│   └── providers/          # LenisProvider (smooth scroll + GSAP sync)
├── lib/                    # CMS adapter, analytics, Sentry, Lenis, Cloudinary
├── types/                  # Shared TypeScript types
├── data/content.json       # CMS fallback mock data
├── sanity/                 # Sanity schema scaffold
├── styles/globals.css      # Tailwind + CSS custom properties
├── public/                 # Static assets (images, Lottie JSON)
└── __tests__/              # React Testing Library tests
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js **20+**
- npm **10+**

### 1. Clone and install

```bash
git clone <your-repo-url>
cd Demo_Portfolio
npm install
```

### 2. Configure environment variables (optional)

```bash
cp .env.local.example .env.local
```

The site works **out of the box without any env vars** — it falls back to `data/content.json`.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Enable Sanity CMS |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Enable Cloudinary image CDN |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Enable Google Analytics |
| `NEXT_PUBLIC_SENTRY_DSN` | Enable Sentry error monitoring |

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🏗 Build & Deploy

### Local build

```bash
npm run build
npm start
```

### Deploy to Vercel (recommended)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Set environment variables in the Vercel dashboard.
4. Vercel auto-detects Next.js — click **Deploy**.

Every push to `main` will trigger a production deploy automatically.

---

## 🧪 Testing

```bash
npm test           # Run all tests once
npm run test:watch # Watch mode
```

Tests are located in `__tests__/` and use **Jest** + **React Testing Library**.

---

## 🔍 Linting

```bash
npm run lint
```

Includes `eslint-plugin-jsx-a11y` to catch accessibility issues.

---

## 📦 Key Dependencies

| Library | Purpose |
|---|---|
| `next@14` | Framework (App Router) |
| `gsap` + `ScrollTrigger` | Scroll animations |
| `framer-motion` | Micro-interactions |
| `@studio-freight/lenis` | Smooth scroll |
| `three` | 3D hero scene |
| `@lottiefiles/react-lottie-player` | Lottie animations |
| `@radix-ui/*` | Accessible UI primitives |
| `react-hook-form` + `zod` | Form validation |
| `styled-components` | Themed Button component |
| `@sanity/client` | CMS (optional) |
| `tailwindcss` | Utility-first styles |

---

## 🎨 Customization

### Content
Edit `data/content.json` to update projects, blog posts, skills, and bio — no CMS required.

### Theme
Update `tailwind.config.ts` → `theme.extend.colors` to change the brand colour palette.

### Author info
Update `data/content.json` → `author` and the `NEXT_PUBLIC_SITE_URL` env var.

### Add a real CMS
1. Create a Sanity project at [sanity.io](https://www.sanity.io/).
2. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in `.env.local`.
3. Deploy the Sanity Studio with schemas from `sanity/schema/`.
4. `lib/cms.ts` will automatically switch from the JSON fallback to Sanity.

---

## ⚡ Lighthouse Optimizations

- `next/image` for automatic WebP/AVIF conversion and lazy loading
- `priority` prop on hero and above-the-fold images
- Fonts loaded via `<link rel="preconnect">` and `display=swap`
- Three.js canvas rendered client-side only (no SSR overhead)
- GSAP `ScrollTrigger` cleanup on unmount to prevent memory leaks
- Lenis `lagSmoothing(0)` for accurate scroll-sync with GSAP
- ISR (`revalidate = 3600`) for fresh content without rebuild

**Target scores:** Performance 90+, Accessibility 95+, Best Practices 95+, SEO 100.

---

## 🔒 Security

- Security headers set in `next.config.js` (`X-Frame-Options`, `X-Content-Type-Options`, etc.)
- `noopener noreferrer` on all external links
- Zod server-side validation on the `/api/contact` route
- No API keys committed — all via environment variables
- `@typescript-eslint/no-explicit-any` enforced via ESLint

---

## 📄 License

MIT — feel free to use this as a template for your own portfolio!
