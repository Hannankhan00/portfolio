# Hannan Khan — Portfolio Audit & Improvement Roadmap

> **Domain Target**: [`hannankhan.dev`](https://hannankhan.dev)  
> **Tech Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, GSAP, Neon Postgres, Three.js / Rapier

---

## 📌 Status Overview

| Phase | Focus Area | Status |
| :--- | :--- | :--- |
| **Phase 1** | Core UX & Navigation (Scrollbar, Project Section, Custom Cursor) | ✅ **Completed** |
| **Phase 2** | Recruiter & Client Conversion (Resume, Direct Actions, Case Studies) | 🟡 **In Progress** |
| **Phase 3** | Performance & Asset Optimization (WebP, GLB compression, SSR) | ⚪ **Planned** |
| **Phase 4** | SEO, OpenGraph & Social Proof | ⚪ **Planned** |

---

## ✅ Completed Improvements

- [x] **Sleek Custom Scrollbar**
  - Replaced hidden native scrollbar with an obsidian-and-violet pill scrollbar (`7px`).
  - Restored drag-to-scroll functionality for desktop and trackpad users.
  - Hover state glows with purple accent (`rgba(168, 85, 247, 0.70)`).
- [x] **Upgraded Projects Section (Editorial List)**
  - Retained minimalist typography list without needing a rigid Bento grid.
  - **Floating Cursor Screenshot Preview**: Follows mouse on desktop at 60fps with GSAP tracking, giving immediate visual context on hover.
  - **Direct "Live Demo" Buttons**: Embedded on every project row with event propagation stopped, enabling 1-click site visits.
  - **Subtitles & Badges**: Cleanly displayed alongside titles for rapid scannability.
  - **Mobile Visual Support**: Direct thumbnail preview on touchscreens (`< md`).
- [x] **Original Custom Cursor Preserved**
  - Kept your original custom SVG cursor with dynamic velocity-based scaling and difference blend mode.
- [x] **Tailwind v4 IDE Configuration**
  - Added `.vscode/settings.json` with `"css.lint.unknownAtRules": "ignore"` to eliminate `@theme` CSS warnings.

---

## 🚀 High-Priority Improvements (Recruiter & Client Conversion)

### 1. 1-Click Resume / CV Download
* **Problem**: Recruiters and engineering managers typically spend 15–30 seconds reviewing a portfolio. Currently, there is no direct link or button to view/download your CV.
* **Action**:
  - Add a PDF resume into `public/assets/hannan_khan_resume.pdf`.
  - Add a `"Download CV"` or `"View Resume"` button in the Hero section right beside `"Let's Talk"` in [app/components/Hero.tsx](file:///e:/my%20work/portfolio/app/components/Hero.tsx).
  - Add a `"Resume"` item to the navigation menu in [app/components/Menu.tsx](file:///e:/my%20work/portfolio/app/components/Menu.tsx).

### 2. Case Study Framework in Project Modal
* **Problem**: Modal highlights currently list tech tools, but hiring managers look for problem-solving ability and engineering impact.
* **Action**:
  - Structure each project description around:
    1. **The Challenge / Problem**: What business or technical bottleneck existed?
    2. **Architecture Decisions**: Why pair Python Flask with Sentence-Transformers alongside Next.js 16 for SkillSpill?
    3. **Measurable Outcome**: Candidate screening speedup, user volume, or system performance.

### 3. Clickable Hero Scroll Indicator
* **Problem**: The animated chevron chevrons in [app/components/ScrollArrow.tsx](file:///e:/my%20work/portfolio/app/components/ScrollArrow.tsx) are currently non-interactive SVGs.
* **Action**:
  - Wrap in an accessible button with `onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}`.

---

## ⚡ Performance & Asset Optimization

### 4. Image Compression & WebP Migration
* **Current Payload**:
  - `card.glb`: **2.45 MB**
  - `profile.png`: **1.87 MB**
  - `fouratek.png`: **1.37 MB**
  - `compactpersonnel.png`: **1.28 MB**
  - `skillspill.png`: **1.21 MB**
  - Total payload is **~9.5 MB**, which slows down initial page load and Largest Contentful Paint (LCP) on slower networks.
* **Action**:
  - Compress all project screenshots into `.webp` or `.avif` (reducing size by ~85% with zero visible quality degradation).
  - Optimize `card.glb` with **Draco compression** or `gltfpack` to reduce it from 2.45 MB to ~350 KB.

### 5. Server-Side Data Fetching (SSR / ISR)
* **Problem**: [Projects.tsx](file:///e:/my%20work/portfolio/app/components/Projects.tsx) and [Experience.tsx](file:///e:/my%20work/portfolio/app/components/Experience.tsx) fetch `/api/projects` client-side using `useEffect`.
* **Action**:
  - In [app/page.tsx](file:///e:/my%20work/portfolio/app/page.tsx), call `getPublishedProjects()` directly on the server from [lib/db.ts](file:///e:/my%20work/portfolio/lib/db.ts) and pass data as props.
  - This eliminates client waterfall delays and ensures search engine bots immediately index all projects.

### 6. Graceful 2D Fallback for 3D Lanyard
* **Problem**: If WebGL context is lost or blocked on low-end hardware, the Hero renders an empty space.
* **Action**:
  - Render a sleek 2D glassmorphic profile card with subtle tilt and glow whenever WebGL is unavailable.

---

## 🔍 SEO, Metadata & Discoverability

### 7. Rich Metadata & Open Graph Cards
* **Action**: Update [app/layout.tsx](file:///e:/my%20work/portfolio/app/layout.tsx) with complete OpenGraph & Twitter tags:
  ```ts
  export const metadata: Metadata = {
    title: "Hannan Khan | Full Stack Developer",
    description: "Full Stack Developer building scalable web applications with Next.js, React, Node.js, and TypeScript.",
    metadataBase: new URL("https://hannankhan.dev"),
    openGraph: {
      title: "Hannan Khan | Full Stack Developer",
      description: "Building performant, scalable web apps from polished frontends to robust backends.",
      url: "https://hannankhan.dev",
      siteName: "Hannan Khan Portfolio",
      images: [{ url: "/assets/og-image.png", width: 1200, height: 630 }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Hannan Khan | Full Stack Developer",
      images: ["/assets/og-image.png"],
    },
  };
  ```

### 8. Sitemap, Robots & JSON-LD
* **Action**:
  - Add `app/sitemap.ts` and `app/robots.ts` for clean indexing.
  - Add a `Person` JSON-LD structured schema in `layout.tsx`.

---

## 💼 Credibility & Social Proof

### 9. Services / "What I Do" Overview
* **Action**: Add a concise 3-pillar services section to show clients what you build:
  1. **Full-Stack Web Applications** (Next.js, React, Node.js, TypeScript)
  2. **API & Database Engineering** (PostgreSQL/Neon, Prisma, REST, WebSockets)
  3. **Interactive UI/UX & Micro-Animations** (GSAP, Tailwind, Modern responsive design)

### 10. Testimonials / Recommendations
* **Action**: Add 2–3 brief quotes or LinkedIn recommendations from managers or colleagues at **RapidTech Pro** and **Inhancers**.

### 11. Quick Contact Enhancements
* **Action**:
  - Add a **"Copy Email"** button next to your email address that triggers a small toast alert (`"Email copied to clipboard!"`).
  - Optionally provide a Calendly link for high-intent clients looking to schedule a 15-minute discovery call.
