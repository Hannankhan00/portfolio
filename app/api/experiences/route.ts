import { NextRequest, NextResponse } from "next/server";
import { getAllExperiences, getPublishedExperiences, createExperience } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const wantAll = searchParams.get("all") === "true";

    const session = await getSession();
    if (wantAll && session) {
      const experiences = await getAllExperiences();
      return NextResponse.json({ experiences, isAdmin: true });
    }

    const experiences = await getPublishedExperiences();
    return NextResponse.json({ experiences, isAdmin: !!session });
  } catch (error: any) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences from database" },
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
    const { company, role, period, description, order_index, is_published } = body;

    if (!company || !role || !period) {
      return NextResponse.json(
        { error: "Company, role, and period are required fields." },
        { status: 400 }
      );
    }

    const created = await createExperience({
      company: company.trim(),
      role: role.trim(),
      period: period.trim(),
      description: description ? description.trim() : null,
      order_index: typeof order_index === "number" ? order_index : 0,
      is_published: typeof is_published === "boolean" ? is_published : true,
    });

    return NextResponse.json({ success: true, experience: created }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating experience:", error);
    return NextResponse.json(
      { error: "Failed to create experience in database" },
      { status: 500 }
    );
  }
}