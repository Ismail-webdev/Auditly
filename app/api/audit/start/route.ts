import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkHaramContent } from "@/lib/auditor/haram-filter";
import { Client } from "@upstash/qstash";

const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    // Step 1 — Check authentication
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json(
        { error: "You must be logged in to run an audit." },
        { status: 401 },
      );
    }

    // Step 2 — Get URL from request body
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "A valid URL is required." },
        { status: 400 },
      );
    }

    // Step 3 — Validate URL format
    let validatedUrl: string;
    try {
      const parsed = new URL(url);
      validatedUrl = parsed.href;
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format. Please include https://" },
        { status: 400 },
      );
    }

    // Step 4 — Find user in our database
    const user = await db.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User account not found." },
        { status: 404 },
      );
    }

    // Step 5 — Run haram filter BEFORE anything else
    const haramCheck = checkHaramContent(validatedUrl);

    if (haramCheck.isBlocked) {
      // Save blocked audit to database for transparency
      const blockedAudit = await db.audit.create({
        data: {
          url: validatedUrl,
          status: "BLOCKED",
          userId: user.id,
        },
      });

      return NextResponse.json(
        {
          auditId: blockedAudit.id,
          status: "BLOCKED",
          message: haramCheck.reason,
        },
        { status: 403 },
      );
    }

    // Step 6 — Create audit record as PENDING
    const audit = await db.audit.create({
      data: {
        url: validatedUrl,
        status: "PENDING",
        userId: user.id,
      },
    });

    // Step 7 — Send job to QStash for background processing
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    await qstash.publishJSON({
      url: `${appUrl}/api/webhooks/qstash`,
      body: {
        auditId: audit.id,
        url: validatedUrl,
      },
    });

    // Step 8 — Return immediately with auditId
    return NextResponse.json(
      {
        auditId: audit.id,
        status: "PENDING",
        message: "Audit started. Poll /api/audit/[auditId] for updates.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[AUDIT_START]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
