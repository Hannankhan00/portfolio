import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL is not defined in environment");
  process.exit(1);
}

const sql = neon(dbUrl);

async function init() {
  console.log("Connecting to Neon Postgres to initialize schema...");

  // 1. Create admin_users table
  await sql.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(100),
      role VARCHAR(50) DEFAULT 'admin',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("admin_users table verified/created.");

  // 2. Create projects table
  await sql.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      subtitle VARCHAR(255),
      url VARCHAR(500),
      url_label VARCHAR(100),
      description TEXT NOT NULL,
      highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
      tech JSONB NOT NULL DEFAULT '[]'::jsonb,
      image TEXT,
      order_index INTEGER NOT NULL DEFAULT 0,
      is_published BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("projects table verified/created.");

  // 3. Seed requested users:
  // mogli@gmail.com / 2668
  // chuzzii@gmail.com / 2668
  const users = [
    { email: "mogli@gmail.com", pass: "2668", name: "Mogli Admin" },
    { email: "chuzzii@gmail.com", pass: "2668", name: "Chuzzii Admin" },
  ];

  for (const u of users) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(u.pass, salt);

    // Upsert or insert if not exists
    await sql.query(
      `
      INSERT INTO admin_users (email, password_hash, name)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) 
      DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = CURRENT_TIMESTAMP;
      `,
      [u.email, hash, u.name]
    );
    console.log(`User ${u.email} seeded/updated.`);
  }

  // 4. Seed initial projects if empty
  const existingProjects = await sql.query("SELECT COUNT(*) as count FROM projects;");
  const count = parseInt(existingProjects[0]?.count || "0", 10);
  console.log(`Current project count: ${count}`);

  if (count === 0) {
    const initialProjects = [
      {
        title: "SkillSpill",
        subtitle: "AI-powered career & skill marketplace",
        url: "https://skillspill.app",
        url_label: "skillspill.app",
        description:
          "A CV-less hiring platform where recruiters discover and hire talent based on verified skills — not resumes. The AI matching engine runs in three layers: semantic NLP embeddings (all-MiniLM-L6-v2), deterministic skill-overlap scoring, and LLM-driven GitHub code-quality analysis via Groq's llama-3.1-70b — composited into a single explainable match score. Talents build verifiable profiles with GitHub integration; recruiters post bounties and receive a ranked shortlist automatically. A social feed called 'The Spill' makes skill signals public and discoverable, not locked inside a resume PDF.",
        highlights: [
          "Semantic NLP matching with all-MiniLM-L6-v2 — 50% of final score",
          "Verified skill-overlap scoring — 35% of final score",
          "GitHub code quality scored via Groq's llama-3.1-70b — 15% of final score",
          "Social feed 'The Spill' — posts, code blocks, GitHub repo cards, hashtags",
          "Real-time notifications & direct messaging via Pusher",
          "Final Year Project — University of Gujrat, Pakistan",
        ],
        tech: [
          "Next.js 16", "React 19", "TypeScript", "MySQL", "Prisma",
          "Python Flask", "sentence-transformers", "Groq API",
          "Azure Blob Storage", "Pusher", "Tailwind CSS 4",
          "JWT", "GitHub OAuth", "Zod",
        ],
        image: "/assets/skillspill.png",
        order_index: 1,
      },
      {
        title: "Compact Personnel",
        subtitle: "Healthcare & care-staffing platform",
        url: "https://www.compactpersonnel.co.uk",
        url_label: "compactpersonnel.co.uk",
        description:
          "A full landing platform for Compact Personnel, a UK-based care organisation that supports adults with learning disabilities, complex needs, and neurodivergent conditions. The site presents their full service catalogue — Supported Living, Domiciliary Care, Complex Care, Mental Health Support, Live-in Care, Respite, Palliative & End of Life Care, and Hospital-to-Home transitions — with a person-centred design that reflects their mission of independence, choice, and social inclusion. The platform is built to scale with a recruitment system and additional modules.",
        highlights: [
          "Landing platform covering 8 care service categories",
          "Recruitment system integration for care-staff hiring",
          "Person-centred design reflecting the company's therapeutic approach",
          "Framer Motion page transitions and scroll animations",
          "Modular architecture allowing new service pages and features",
        ],
        tech: ["Next.js", "Node.js", "Tailwind CSS", "Framer Motion"],
        image: "/assets/compactpersonnel.png",
        order_index: 2,
      },
      {
        title: "GoTripJapan",
        subtitle: "Travel booking platform",
        url: "https://gotripjapan.com",
        url_label: "gotripjapan.com",
        description:
          "A comprehensive travel booking platform for Japan featuring full booking functionality, seamless PayPal integration for secure payments, and reliable cloud storage for managing user and booking data.",
        highlights: [
          "Full booking and reservation system",
          "Secure payment processing via PayPal integration",
          "Cloud storage integration for user and booking data",
        ],
        tech: ["Next.js", "Node.js", "MySQL", "Tailwind CSS"],
        image: "/assets/gotripjapan.png",
        order_index: 3,
      },
      {
        title: "4Atek",
        subtitle: "Software house platform & custom CMS",
        url: "https://fouratek.com",
        url_label: "fouratek.com",
        description:
          "A complete website and custom-built CMS for 4Atek, a software house. The platform features a beautiful welcome animation powered by Framer Motion, alongside a fully integrated client management system and a robust internal hiring system.",
        highlights: [
          "Custom-built CMS for full content control",
          "Integrated Client Management System",
          "Built-in Hiring and Applicant Tracking System",
          "Framer Motion welcome animations",
        ],
        tech: ["Next.js", "Node.js", "MySQL", "Framer Motion"],
        image: "/assets/fouratek.png",
        order_index: 4,
      },
    ];

    for (const p of initialProjects) {
      await sql.query(
        `
        INSERT INTO projects (title, subtitle, url, url_label, description, highlights, tech, image, order_index)
        VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, $9);
        `,
        [
          p.title,
          p.subtitle,
          p.url,
          p.url_label,
          p.description,
          JSON.stringify(p.highlights),
          JSON.stringify(p.tech),
          p.image,
          p.order_index,
        ]
      );
      console.log(`Project '${p.title}' seeded.`);
    }
  }

  console.log("Database initialization finished successfully!");
}

init().catch((err) => {
  console.error("Init failed:", err);
  process.exit(1);
});
