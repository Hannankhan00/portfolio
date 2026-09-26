import { NextRequest, NextResponse } from "next/server";
import { getAllProjects, getPublishedProjects, createProject } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const wantAll = searchParams.get("all") === "true";

    const session = await getSession();
    
    // If requesting all and authenticated as admin, return all (including drafts)
    if (wantAll && session) {
      const projects = await getAllProjects();
      return NextResponse.json({ projects, isAdmin: true });
    }

    // Otherwise return published projects
    const projects = await getPublishedProjects();
    return NextResponse.json({ projects, isAdmin: !!session });
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects from database" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      title,
      subtitle,
      url,
      urlLabel,
      description,
      highlights,
      tech,
      image,
      order_index,
      is_published,
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required fields" },
        { status: 400 }
      );
    }

    const created = await createProject({
      title,
      subtitle: subtitle || "",
      url: url || "",
      urlLabel: urlLabel || "",
      description,
      highlights: Array.isArray(highlights) ? highlights : [],
      tech: Array.isArray(tech) ? tech : [],
      image: image || null,
      order_index: typeof order_index === "number" ? order_index : 0,
      is_published: typeof is_published === "boolean" ? is_published : true,
    });

    return NextResponse.json({ success: true, project: created }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project in database" },
      { status: 500 }
    );
  }
}
