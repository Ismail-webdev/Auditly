const BLOCKED_KEYWORDS = [
  // Gambling
  "casino",
  "gambling",
  "betting",
  "lottery",
  "poker",
  "slots",
  // Adult
  "adult",
  "porn",
  "xxx",
  "escort",
  "onlyfans",
  // Riba (interest-based finance)
  "payday-loan",
  "paydayloan",
  "interest-rate",
  // Alcohol
  "whiskey",
  "brewery",
  "winery",
  // Weapons
  "gunshop",
  "ammunition",
];

export interface HaramCheckResult {
  isBlocked: boolean;
  reason: string | null;
}

export function checkHaramContent(url: string): HaramCheckResult {
  const normalizedUrl = url.toLowerCase();

  for (const keyword of BLOCKED_KEYWORDS) {
    if (normalizedUrl.includes(keyword)) {
      return {
        isBlocked: true,
        reason: `This URL contains content that is not permitted under our content policy (matched: ${keyword}).`,
      };
    }
  }

  return {
    isBlocked: false,
    reason: null,
  };
}
