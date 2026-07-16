import { Page } from "playwright";

export interface PerformanceIssue {
  type: string;
  severity: "high" | "medium" | "low";
  message: string;
  fix: string;
}

export interface PerformanceResult {
  score: number;
  loadTimeMs: number;
  issues: PerformanceIssue[];
}

export async function checkPerformance(
  page: Page,
  loadTimeMs: number,
): Promise<PerformanceResult> {
  const issues: PerformanceIssue[] = [];

  if (loadTimeMs > 3000) {
    issues.push({
      type: "slow-load-time",
      severity: "high",
      message: `Page took ${(loadTimeMs / 1000).toFixed(1)}s to load. Anything over 3s loses visitors.`,
      fix: "Compress images, enable caching, and consider a CDN to reduce load time.",
    });
  } else if (loadTimeMs > 1500) {
    issues.push({
      type: "moderate-load-time",
      severity: "medium",
      message: `Page took ${(loadTimeMs / 1000).toFixed(1)}s to load. Target is under 1.5s.`,
      fix: "Optimize images and reduce the number of render-blocking scripts.",
    });
  }

  //   Check for unoptimized images
  const unoptimizedImages = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll("img"));
    return images.filter((img) => {
      const src = img.src || "";
      return (
        !src.includes(".webp") &&
        !src.includes(".avif") &&
        src.startsWith("http")
      );
    }).length;
  });

  if (unoptimizedImages > 0) {
    issues.push({
      type: "unoptimized-images",
      severity: "medium",
      message: `${unoptimizedImages} image(s) are not using modern formats.`,
      fix: "Convert images to WebP or AVIF format. They are 25-35% smaller than JPG/PNG with the same quality.",
    });
  }

  // Check for render blocking scripts
  const renderBlockingScripts = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll("script[src]"));
    return scripts.filter((script) => {
      const el = script as HTMLScriptElement;
      return !el.defer && !el.async;
    }).length;
  });

  if (renderBlockingScripts > 2) {
    issues.push({
      type: "render-blocking-scripts",
      severity: "medium",
      message: `${renderBlockingScripts} render-blocking scripts found.`,
      fix: "Add 'defer' or 'async' attribute to your <script> tags to stop them blocking page rendering.",
    });
  }

  // Check for inline styles (performance smell)
  const inlineStyles = await page.evaluate(() => {
    return document.querySelectorAll("[style]").length;
  });

  if (inlineStyles > 10) {
    issues.push({
      type: "excessive-inline-styles",
      severity: "low",
      message: `${inlineStyles} elements use inline styles.`,
      fix: "Move inline styles to a stylesheet. This improves caching and reduces HTML size.",
    });
  }

  const highIssues = issues.filter((i) => i.severity === "high").length;
  const mediumIssues = issues.filter((i) => i.severity === "medium").length;
  const lowIssues = issues.filter((i) => i.severity === "low").length;

  const deductions = highIssues * 20 + mediumIssues * 10 + lowIssues * 5;
  const score = Math.max(0, 100 - deductions);

  return { score, loadTimeMs, issues };
}
