import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  createContactMessage,
  getAllContactMessages,
  markContactMessageRead,
  deleteContactMessage,
} from "@/lib/db";
import { sendContactNotificationEmail } from "@/lib/email";

// POST /api/contact — Public submission
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Save message to Neon PostgreSQL
    const savedMsg = await createContactMessage({
      name: name.trim(),
      email: email.trim(),
      subject: subject && typeof subject === "string" ? subject.trim() : null,
      message: message.trim(),
    });

    // Send email notification (non-blocking / graceful fallback if SMTP not yet configured)
    sendContactNotificationEmail({
      name: savedMsg.name,
      email: savedMsg.email,
      subject: savedMsg.subject,
      message: savedMsg.message,
    }).catch((err) => {
      console.error("[Contact API] Background email send error:", err);
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully. I will get back to you shortly.",
      id: savedMsg.id,
    });
  } catch (err: any) {
    console.error("[Contact API] Error saving contact message:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

// GET /api/contact — Admin: list all messages
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await getAllContactMessages();
    return NextResponse.json({ messages });
  } catch (err: any) {
    console.error("[Contact API] Error fetching messages:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/contact — Admin: mark as read/unread
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, is_read } = body;

    if (!id || typeof id !== "number") {
      return NextResponse.json({ error: "Valid message ID is required" }, { status: 400 });
    }

    const updated = await markContactMessageRead(id, is_read !== undefined ? Boolean(is_read) : true);
    if (!updated) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: updated });
  } catch (err: any) {
    console.error("[Contact API] Error updating message:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/contact — Admin: delete message
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    const id = idParam ? parseInt(idParam, 10) : null;

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "Valid message ID is required" }, { status: 400 });
    }

    await deleteContactMessage(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[Contact API] Error deleting message:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
