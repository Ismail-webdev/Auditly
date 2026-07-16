import { CheerioAPI } from "cheerio";

export interface AccessibilityIssue {
  type: string;
  severity: "high" | "medium" | "low";
  message: string;
  fix: string;
}

export interface AccessibilityResult {
  score: number;
  issues: AccessibilityIssue[];
}

export function checkAccessibility($: CheerioAPI): AccessibilityResult {
  const issues: AccessibilityIssue[] = [];

  // Check html lang attribute
  const htmlLang = $("html").attr("lang");
  if (!htmlLang || htmlLang.trim() === "") {
    issues.push({
      type: "missing-lang",
      severity: "high",
      message: "Page is missing a language attribute on the <html> tag.",
      fix: "Add lang='en' (or your page language) to your <html> tag. Screen readers use this to select the correct voice.",
    });
  }

  // Check buttons without text
  let emptyButtons = 0;
  $("button").each((_, el) => {
    const text = $(el).text().trim();
    const ariaLabel = $(el).attr("aria-label");
    if (!text && !ariaLabel) {
      emptyButtons++;
    }
  });

  if (emptyButtons > 0) {
    issues.push({
      type: "empty-buttons",
      severity: "high",
      message: `${emptyButtons} button(s) have no text or aria-label.`,
      fix: "Add descriptive text or an aria-label attribute to every button so screen reader users know what it does.",
    });
  }

  // Check links without text
  let emptyLinks = 0;
  $("a").each((_, el) => {
    const text = $(el).text().trim();
    const ariaLabel = $(el).attr("aria-label");
    if (!text && !ariaLabel) {
      emptyLinks++;
    }
  });

  if (emptyLinks > 0) {
    issues.push({
      type: "empty-links",
      severity: "high",
      message: `${emptyLinks} link(s) have no text or aria-label.`,
      fix: "Add descriptive text or aria-label to every link. Avoid using 'click here' — use descriptive text like 'Read our privacy policy'.",
    });
  }

  // Check inputs without labels
  let unlabelledInputs = 0;
  $("input").each((_, el) => {
    const id = $(el).attr("id");
    const ariaLabel = $(el).attr("aria-label");
    const hasLabel = id ? $(`label[for="${id}"]`).length > 0 : false;
    if (!hasLabel && !ariaLabel) {
      unlabelledInputs++;
    }
  });

  if (unlabelledInputs > 0) {
    issues.push({
      type: "inputs-missing-labels",
      severity: "high",
      message: `${unlabelledInputs} input field(s) have no associated label.`,
      fix: "Add a <label for='inputId'> element for every input field, or use aria-label attribute.",
    });
  }

  // Check for skip navigation link
  const skipLink = $('a[href="#main"], a[href="#content"], a[href="#skip"]');
  if (skipLink.length === 0) {
    issues.push({
      type: "missing-skip-link",
      severity: "medium",
      message: "Page has no skip navigation link.",
      fix: "Add a 'Skip to main content' link as the first element on the page so keyboard users can bypass navigation.",
    });
  }

  // Check for viewport meta tag
  const viewport = $('meta[name="viewport"]').attr("content");
  if (!viewport) {
    issues.push({
      type: "missing-viewport",
      severity: "medium",
      message: "Page is missing a viewport meta tag.",
      fix: "Add <meta name='viewport' content='width=device-width, initial-scale=1'> for proper mobile rendering.",
    });
  }

  // Check for tab index abuse
  let badTabIndex = 0;
  $("[tabindex]").each((_, el) => {
    const tabindex = parseInt($(el).attr("tabindex") || "0");
    if (tabindex > 0) {
      badTabIndex++;
    }
  });

  if (badTabIndex > 0) {
    issues.push({
      type: "positive-tabindex",
      severity: "low",
      message: `${badTabIndex} element(s) use a positive tabindex value.`,
      fix: "Avoid tabindex values greater than 0. They disrupt the natural keyboard navigation flow. Use tabindex='0' or '-1' only.",
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
