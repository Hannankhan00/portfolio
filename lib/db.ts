import { neon, NeonQueryFunction } from "@neondatabase/serverless";

export interface DbProject {
  id: number;
  title: string;
  subtitle: string;
  url: string;
  urlLabel: string;
  description: string;
  highlights: string[];
  tech: string[];
  image: string | null;
  order_index: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AdminUser {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
  role: string;
  created_at?: string;
}

let sqlInstance: NeonQueryFunction<false, false> | null = null;

export function getDb() {
  if (!sqlInstance) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL environment variable is not defined");
    }
    sqlInstance = neon(url);
  }
  return sqlInstance;
}

export async function getAllProjects(): Promise<DbProject[]> {
  const sql = getDb();
  const rows = await sql.query(
    `SELECT id, title, subtitle, url, url_label as "urlLabel", description, 
            highlights, tech, image, order_index, is_published, created_at, updated_at
     FROM projects
     ORDER BY order_index ASC, id ASC;`
  );

  return rows.map((r: any) => ({
    id: r.id,
    title: r.title,
    subtitle: r.subtitle || "",
    url: r.url || "",
    urlLabel: r.urlLabel || "",
    description: r.description || "",
    highlights: Array.isArray(r.highlights) ? r.highlights : (typeof r.highlights === "string" ? JSON.parse(r.highlights) : []),
    tech: Array.isArray(r.tech) ? r.tech : (typeof r.tech === "string" ? JSON.parse(r.tech) : []),
    image: r.image || null,
    order_index: r.order_index ?? 0,
    is_published: r.is_published ?? true,
    created_at: r.created_at,
    updated_at: r.updated_at,
  }));
}

export async function getPublishedProjects(): Promise<DbProject[]> {
  const sql = getDb();
  const rows = await sql.query(
    `SELECT id, title, subtitle, url, url_label as "urlLabel", description, 
            highlights, tech, image, order_index, is_published, created_at, updated_at
     FROM projects
     WHERE is_published = true
     ORDER BY order_index ASC, id ASC;`
  );

  return rows.map((r: any) => ({
    id: r.id,
    title: r.title,
    subtitle: r.subtitle || "",
    url: r.url || "",
    urlLabel: r.urlLabel || "",
    description: r.description || "",
    highlights: Array.isArray(r.highlights) ? r.highlights : (typeof r.highlights === "string" ? JSON.parse(r.highlights) : []),
    tech: Array.isArray(r.tech) ? r.tech : (typeof r.tech === "string" ? JSON.parse(r.tech) : []),
    image: r.image || null,
    order_index: r.order_index ?? 0,
    is_published: r.is_published ?? true,
    created_at: r.created_at,
    updated_at: r.updated_at,
  }));
}

export async function getProjectById(id: number): Promise<DbProject | null> {
  const sql = getDb();
  const rows = await sql.query(
    `SELECT id, title, subtitle, url, url_label as "urlLabel", description, 
            highlights, tech, image, order_index, is_published, created_at, updated_at
     FROM projects
     WHERE id = $1;`,
    [id]
  );
  if (!rows || rows.length === 0) return null;
  const r: any = rows[0];
  return {
    id: r.id,
    title: r.title,
    subtitle: r.subtitle || "",
    url: r.url || "",
    urlLabel: r.urlLabel || "",
    description: r.description || "",
    highlights: Array.isArray(r.highlights) ? r.highlights : (typeof r.highlights === "string" ? JSON.parse(r.highlights) : []),
    tech: Array.isArray(r.tech) ? r.tech : (typeof r.tech === "string" ? JSON.parse(r.tech) : []),
    image: r.image || null,
    order_index: r.order_index ?? 0,
    is_published: r.is_published ?? true,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

export async function createProject(data: {
  title: string;
  subtitle?: string;
  url?: string;
  urlLabel?: string;
  description: string;
  highlights?: string[];
  tech?: string[];
  image?: string | null;
  order_index?: number;
  is_published?: boolean;
}): Promise<DbProject> {
  const sql = getDb();
  const highlightsJson = JSON.stringify(data.highlights || []);
  const techJson = JSON.stringify(data.tech || []);
  const orderIndex = data.order_index ?? 0;
  const isPublished = data.is_published ?? true;

  const rows = await sql.query(
    `INSERT INTO projects (title, subtitle, url, url_label, description, highlights, tech, image, order_index, is_published)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, $9, $10)
     RETURNING id, title, subtitle, url, url_label as "urlLabel", description, 
               highlights, tech, image, order_index, is_published, created_at, updated_at;`,
    [
      data.title,
      data.subtitle || "",
      data.url || "",
      data.urlLabel || "",
      data.description,
      highlightsJson,
      techJson,
      data.image || null,
      orderIndex,
      isPublished,
    ]
  );
  const r: any = rows[0];
  return {
    id: r.id,
    title: r.title,
    subtitle: r.subtitle || "",
    url: r.url || "",
    urlLabel: r.urlLabel || "",
    description: r.description || "",
    highlights: Array.isArray(r.highlights) ? r.highlights : (typeof r.highlights === "string" ? JSON.parse(r.highlights) : []),
    tech: Array.isArray(r.tech) ? r.tech : (typeof r.tech === "string" ? JSON.parse(r.tech) : []),
    image: r.image || null,
    order_index: r.order_index ?? 0,
    is_published: r.is_published ?? true,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

export async function updateProject(
  id: number,
  data: Partial<{
    title: string;
    subtitle: string;
    url: string;
    urlLabel: string;
    description: string;
    highlights: string[];
    tech: string[];
    image: string | null;
    order_index: number;
    is_published: boolean;
  }>
): Promise<DbProject | null> {
  const sql = getDb();
  const existing = await getProjectById(id);
  if (!existing) return null;

  const title = data.title !== undefined ? data.title : existing.title;
  const subtitle = data.subtitle !== undefined ? data.subtitle : existing.subtitle;
  const url = data.url !== undefined ? data.url : existing.url;
  const urlLabel = data.urlLabel !== undefined ? data.urlLabel : existing.urlLabel;
  const description = data.description !== undefined ? data.description : existing.description;
  const highlights = data.highlights !== undefined ? data.highlights : existing.highlights;
  const tech = data.tech !== undefined ? data.tech : existing.tech;
  const image = data.image !== undefined ? data.image : existing.image;
  const orderIndex = data.order_index !== undefined ? data.order_index : existing.order_index;
  const isPublished = data.is_published !== undefined ? data.is_published : existing.is_published;

  const rows = await sql.query(
    `UPDATE projects
     SET title = $1, subtitle = $2, url = $3, url_label = $4, description = $5,
         highlights = $6::jsonb, tech = $7::jsonb, image = $8, order_index = $9,
         is_published = $10, updated_at = CURRENT_TIMESTAMP
     WHERE id = $11
     RETURNING id, title, subtitle, url, url_label as "urlLabel", description, 
               highlights, tech, image, order_index, is_published, created_at, updated_at;`,
    [
      title,
      subtitle,
      url,
      urlLabel,
      description,
      JSON.stringify(highlights),
      JSON.stringify(tech),
      image,
      orderIndex,
      isPublished,
      id,
    ]
  );
  if (!rows || rows.length === 0) return null;
  const r: any = rows[0];
  return {
    id: r.id,
    title: r.title,
    subtitle: r.subtitle || "",
    url: r.url || "",
    urlLabel: r.urlLabel || "",
    description: r.description || "",
    highlights: Array.isArray(r.highlights) ? r.highlights : (typeof r.highlights === "string" ? JSON.parse(r.highlights) : []),
    tech: Array.isArray(r.tech) ? r.tech : (typeof r.tech === "string" ? JSON.parse(r.tech) : []),
    image: r.image || null,
    order_index: r.order_index ?? 0,
    is_published: r.is_published ?? true,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

export async function deleteProject(id: number): Promise<boolean> {
  const sql = getDb();
  await sql.query(`DELETE FROM projects WHERE id = $1;`, [id]);
  return true;
}

export async function findAdminByEmail(email: string): Promise<AdminUser | null> {
  const sql = getDb();
  const rows = await sql.query(
    `SELECT id, email, password_hash, name, role, created_at
     FROM admin_users
     WHERE LOWER(email) = LOWER($1);`,
    [email.trim()]
  );
  if (!rows || rows.length === 0) return null;
  return rows[0] as AdminUser;
}

export interface DbExperience {
  id: number;
  company: string;
  role: string;
  period: string;
  description: string | null;
  order_index: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getAllExperiences(): Promise<DbExperience[]> {
  const sql = getDb();
  const rows = await sql.query(
    `SELECT id, company, role, period, description, order_index, is_published, created_at, updated_at
     FROM experiences
     ORDER BY order_index ASC, id ASC;`
  );
  return rows as DbExperience[];
}

export async function getPublishedExperiences(): Promise<DbExperience[]> {
  const sql = getDb();
  const rows = await sql.query(
    `SELECT id, company, role, period, description, order_index, is_published, created_at, updated_at
     FROM experiences
     WHERE is_published = true
     ORDER BY order_index ASC, id ASC;`
  );
  return rows as DbExperience[];
}

export async function getExperienceById(id: number): Promise<DbExperience | null> {
  const sql = getDb();
  const rows = await sql.query(
    `SELECT id, company, role, period, description, order_index, is_published, created_at, updated_at
     FROM experiences
     WHERE id = $1;`,
    [id]
  );
  if (!rows || rows.length === 0) return null;
  return rows[0] as DbExperience;
}

export async function createExperience(data: {
  company: string;
  role: string;
  period: string;
  description?: string | null;
  order_index?: number;
  is_published?: boolean;
}): Promise<DbExperience> {
  const sql = getDb();
  const orderIndex = data.order_index ?? 0;
  const isPublished = data.is_published ?? true;
  const rows = await sql.query(
    `INSERT INTO experiences (company, role, period, description, order_index, is_published)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, company, role, period, description, order_index, is_published, created_at, updated_at;`,
    [data.company, data.role, data.period, data.description || null, orderIndex, isPublished]
  );
  return rows[0] as DbExperience;
}

export async function updateExperience(
  id: number,
  data: Partial<{
    company: string;
    role: string;
    period: string;
    description: string | null;
    order_index: number;
    is_published: boolean;
  }>
): Promise<DbExperience | null> {
  const sql = getDb();
  const existing = await getExperienceById(id);
  if (!existing) return null;

  const company = data.company !== undefined ? data.company : existing.company;
  const role = data.role !== undefined ? data.role : existing.role;
  const period = data.period !== undefined ? data.period : existing.period;
  const description = data.description !== undefined ? data.description : existing.description;
  const orderIndex = data.order_index !== undefined ? data.order_index : existing.order_index;
  const isPublished = data.is_published !== undefined ? data.is_published : existing.is_published;

  const rows = await sql.query(
    `UPDATE experiences
     SET company = $1, role = $2, period = $3, description = $4,
         order_index = $5, is_published = $6, updated_at = CURRENT_TIMESTAMP
     WHERE id = $7
     RETURNING id, company, role, period, description, order_index, is_published, created_at, updated_at;`,
    [company, role, period, description, orderIndex, isPublished, id]
  );
  if (!rows || rows.length === 0) return null;
  return rows[0] as DbExperience;
}

export async function deleteExperience(id: number): Promise<boolean> {
  const sql = getDb();
  await sql.query(`DELETE FROM experiences WHERE id = $1;`, [id]);
  return true;
}

export interface DbContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export async function createContactMessage(data: {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
}): Promise<DbContactMessage> {
  const sql = getDb();
  const rows = await sql.query(
    `INSERT INTO contact_messages (name, email, subject, message, is_read)
     VALUES ($1, $2, $3, $4, false)
     RETURNING id, name, email, subject, message, is_read, created_at;`,
    [data.name.trim(), data.email.trim(), data.subject?.trim() || null, data.message.trim()]
  );
  return rows[0] as DbContactMessage;
}

export async function getAllContactMessages(): Promise<DbContactMessage[]> {
  const sql = getDb();
  const rows = await sql.query(
    `SELECT id, name, email, subject, message, is_read, created_at
     FROM contact_messages
     ORDER BY created_at DESC;`
  );
  return rows as DbContactMessage[];
}

export async function markContactMessageRead(id: number, isRead: boolean = true): Promise<DbContactMessage | null> {
  const sql = getDb();
  const rows = await sql.query(
    `UPDATE contact_messages
     SET is_read = $1
     WHERE id = $2
     RETURNING id, name, email, subject, message, is_read, created_at;`,
    [isRead, id]
  );
  if (!rows || rows.length === 0) return null;
  return rows[0] as DbContactMessage;
}

export async function deleteContactMessage(id: number): Promise<boolean> {
  const sql = getDb();
  await sql.query(`DELETE FROM contact_messages WHERE id = $1;`, [id]);
  return true;
}

