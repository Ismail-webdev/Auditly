import { chromium } from "playwright";
import * as cheerio from "cheerio";
import { checkSeo } from "./seo";
import { checkPerformance } from "./performance";
import { checkAccessibility } from "./accessibility";

export interface CrawlResult {
  url: string;
  seoScore: number;
  perfScore: number;
  a11yScore: number;
  overallScore: number;
  issues: AllIssues;
  screenshot: string | null;
}

export interface AllIssues {
  seo: import("./seo").SeoIssue[];
  performance: import("./performance").PerformanceIssue[];
  accessibility: import("./accessibility").AccessibilityIssue[];
}

export async function crawlWebsite(url: string): Promise<CrawlResult> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Set a realistic viewport and user agent
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.setExtraHTTPHeaders({
      "User-Agent":
        "Mozilla/5.0 (compatible; Auditly/1.0; +https://auditly.com/bot)",
    });

    // Measure load time
    const startTime = Date.now();
    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    const loadTimeMs = Date.now() - startTime;

    // Get raw HTML for Cheerio
    const html = await page.content();
    const $ = cheerio.load(html);

    // Take screenshot
    const screenshotBuffer = await page.screenshot({
      fullPage: false,
      type: "jpeg",
      quality: 80,
    });
    const screenshot = screenshotBuffer.toString("base64");

    // Run all checkers in parallel
    const [seoResult, perfResult, a11yResult] = await Promise.all([
      checkSeo($, url),
      checkPerformance(page, loadTimeMs),
      checkAccessibility($),
    ]);

    // Calculate overall score (weighted average)
    const overallScore = Math.round(
      seoResult.score * 0.4 + perfResult.score * 0.35 + a11yResult.score * 0.25,
    );

    return {
      url,
      seoScore: seoResult.score,
      perfScore: perfResult.score,
      a11yScore: a11yResult.score,
      overallScore,
      issues: {
        seo: seoResult.issues,
        performance: perfResult.issues,
        accessibility: a11yResult.issues,
      },
      screenshot,
    };
  } finally {
    await browser.close();
  }
}
