import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { crawlWebsite } from "@/lib/auditor/crawl";

async function handler(request: NextRequest) {
  try {
    // Step 1 — Parse the job payload from QStash
    const body = await request.json();
    const { auditId, url } = body;

    if (!auditId || !url) {
      return NextResponse.json(
        { error: "Missing auditId or url." },
        { status: 400 },
      );
    }

    // Step 2 — Update status to CRAWLING
    await db.audit.update({
      where: { id: auditId },
      data: { status: "CRAWLING" },
    });

    // Step 3 — Run the crawler
    const crawlResult = await crawlWebsite(url);

    // Step 4 — Update status to ANALYZING
    await db.audit.update({
      where: { id: auditId },
      data: { status: "ANALYZING" },
    });

    // Step 5 — Save all results to database
    await db.audit.update({
      where: { id: auditId },
      data: {
        status: "COMPLETE",
        score: crawlResult.overallScore,
        seoScore: crawlResult.seoScore,
        perfScore: crawlResult.perfScore,
        a11yScore: crawlResult.a11yScore,
        issues: crawlResult.issues,
        screenshot: crawlResult.screenshot,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, auditId }, { status: 200 });
  } catch (error) {
    console.error("[QSTASH_WEBHOOK]", error);

    // Extract auditId from body for error handling
    try {
      const body = await request.json();
      if (body.auditId) {
        await db.audit.update({
          where: { id: body.auditId },
          data: { status: "FAILED" },
        });
      }
    } catch {
      // Body already consumed — skip
    }

    return NextResponse.json(
      { error: "Audit processing failed." },
      { status: 500 },
    );
  }
}

export const POST = verifySignatureAppRouter(handler);
