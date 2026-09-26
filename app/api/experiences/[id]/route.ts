import { NextRequest, NextResponse } from "next/server";
import { updateExperience, deleteExperience, getExperienceById } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid experience ID" }, { status: 400 });
    }

    const exp = await getExperienceById(numericId);
    if (!exp) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    return NextResponse.json({ experience: exp });
  } catch (error: any) {
    console.error("Error fetching experience:", error);
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid experience ID" }, { status: 400 });
    }

    const body = await req.json();
    const updated = await updateExperience(numericId, body);
    if (!updated) {
      return NextResponse.json({ error: "Experience not found or update failed" }, { status: 404 });
    }

    return NextResponse.json({ success: true, experience: updated });
  } catch (error: any) {
    console.error("Error updating experience:", error);
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid experience ID" }, { status: 400 });
    }

    await deleteExperience(numericId);
    return NextResponse.json({ success: true, message: "Experience deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting experience:", error);
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}