import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { ApiResponse } from "@/types";

const contactSchema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email(),
  subject: z.string().min(5).max(200),
  message: z.string().min(20).max(5000),
});

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid form data", data: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    // ── TODO: Replace this with a real email provider ──────────────────────
    // Option A: Resend   → import { Resend } from "resend"; resend.emails.send(...)
    // Option B: Nodemailer → nodemailer.createTransport(...).sendMail(...)
    // For now, log to console (safe for dev; no data exposure in production build)
    console.info("[Contact Form Submission]", {
      name,
      email,
      subject,
      messageLength: message.length,
      // Do NOT log the full message in production — kept minimal here
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[/api/contact] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Reject non-POST methods
export function GET(): NextResponse {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
