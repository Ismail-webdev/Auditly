import { CheerioAPI } from "cheerio";

export interface SeoIssue {
  type: string;
  severity: "high" | "medium" | "low";
  message: string;
  fix: string;
}

export interface SeoResult {
  score: number;
  issues: SeoIssue[];
}

export function checkSeo($: CheerioAPI, url: string): SeoResult {
  const issues: SeoIssue[] = [];

  // Check title
  const title = $("title").text().trim();
  if (!title) {
    issues.push({
      type: "missing-title",
      severity: "high",
      message: "Page is missing a title tag.",
      fix: "Add a <title> tag inside your <head> with a descriptive page title between 50-60 characters.",
    });
  } else if (title.length < 30) {
    issues.push({
      type: "short-title",
      severity: "medium",
      message: `Title tag is too short (${title.length} characters).`,
      fix: "Expand your title to between 50-60 characters to improve click-through rates in search results.",
    });
  } else if (title.length > 60) {
    issues.push({
      type: "long-title",
      severity: "low",
      message: `Title tag is too long (${title.length} characters).`,
      fix: "Shorten your title to under 60 characters to prevent it from being cut off in search results.",
    });
  }

  // Check meta description
  const metaDesc = $('meta[name="description"]').attr("content")?.trim();
  if (!metaDesc) {
    issues.push({
      type: "missing-meta-description",
      severity: "high",
      message: "Page is missing a meta description.",
      fix: "Add a <meta name='description' content='...'> tag with a summary between 150-160 characters.",
    });
  } else if (metaDesc.length < 100) {
    issues.push({
      type: "short-meta-description",
      severity: "medium",
      message: `Meta description is too short (${metaDesc.length} characters).`,
      fix: "Expand your meta description to between 150-160 characters for better search visibility.",
    });
  }

  // Check H1
  const h1Count = $("h1").length;
  if (h1Count === 0) {
    issues.push({
      type: "missing-h1",
      severity: "high",
      message: "Page has no H1 heading.",
      fix: "Add exactly one <h1> tag that describes the main topic of this page.",
    });
  } else if (h1Count > 1) {
    issues.push({
      type: "multiple-h1",
      severity: "medium",
      message: `Page has ${h1Count} H1 headings. There should only be one.`,
      fix: "Keep only one <h1> tag per page. Convert the others to <h2> or <h3> tags.",
    });
  }

  // Check images without alt text
  const imagesWithoutAlt: number[] = [];
  $("img").each((index, el) => {
    const alt = $(el).attr("alt");
    if (!alt || alt.trim() === "") {
      imagesWithoutAlt.push(index);
    }
  });

  if (imagesWithoutAlt.length > 0) {
    issues.push({
      type: "images-missing-alt",
      severity: "medium",
      message: `${imagesWithoutAlt.length} image(s) are missing alt attributes.`,
      fix: "Add descriptive alt text to every image. This helps search engines and screen readers understand your images.",
    });
  }

  // Check canonical URL
  const canonical = $('link[rel="canonical"]').attr("href");
  if (!canonical) {
    issues.push({
      type: "missing-canonical",
      severity: "low",
      message: "Page is missing a canonical URL tag.",
      fix: "Add <link rel='canonical' href='your-page-url'> to prevent duplicate content issues.",
    });
  }

  // Check Open Graph tags
  const ogTitle = $('meta[property="og:title"]').attr("content");
  if (!ogTitle) {
    issues.push({
      type: "missing-og-tags",
      severity: "low",
      message: "Page is missing Open Graph tags.",
      fix: "Add og:title, og:description, and og:image meta tags to improve how your page appears when shared on social media.",
    });
  }

  // Calculate score
  const highIssues = issues.filter((i) => i.severity === "high").length;
  const mediumIssues = issues.filter((i) => i.severity === "medium").length;
  const lowIssues = issues.filter((i) => i.severity === "low").length;

  const deductions = highIssues * 20 + mediumIssues * 10 + lowIssues * 5;
  const score = Math.max(0, 100 - deductions);

  return { score, issues };
}
