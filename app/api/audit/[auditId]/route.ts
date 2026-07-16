import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { auditId: string } },
) {
  try {
    // Step 1 — Check authentication
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 },
      );
    }

    // Step 2 — Find user in database
    const user = await db.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User account not found." },
        { status: 404 },
      );
    }

    // Step 3 — Fetch the audit
    const audit = await db.audit.findUnique({
      where: { id: params.auditId },
    });

    if (!audit) {
      return NextResponse.json({ error: "Audit not found." }, { status: 404 });
    }

    // Step 4 — Security check: users can only see their own audits
    if (audit.userId !== user.id) {
      return NextResponse.json(
        { error: "You do not have permission to view this audit." },
        { status: 403 },
      );
    }

    // Step 5 — Return audit data
    return NextResponse.json({ audit }, { status: 200 });
  } catch (error) {
    console.error("[AUDIT_GET]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
