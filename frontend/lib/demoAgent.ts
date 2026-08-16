export type Msg = { role: "user" | "agent"; text: string; code?: string | null };

export const GREETING =
  "Hi! I'm trained on Deploy Chat's own docs. Ask me anything about the product.";

/**
 * A scripted demo, not a live agent. Keyword-matched so typed questions land
 * somewhere sensible, with a fallback that admits what it is rather than
 * bluffing. A bot that guesses badly makes the product look worse than one
 * that names its own limits.
 */
export const DEMO_QA = [
  {
    chip: "How do I embed it?",
    a: "One script tag, anywhere in your page. It works the same in React, Next, Vue, WordPress, Webflow or plain HTML.",
    code: '<script src="https://cdn.deploychat.in/w.js" async></script>',
    keywords: ["embed", "install", "script", "add", "site", "code", "next", "react", "setup"],
  },
  {
    chip: "What can it read?",
    a: "PDFs, crawled websites, Notion, Google Drive, Confluence, CSVs, Postgres, and your own API. It picks up changes on its own, so answers stay current.",
    code: null,
    keywords: ["read", "source", "data", "connect", "pdf", "notion", "drive", "csv", "crawl", "database"],
  },
  {
    chip: "Do you train on my data?",
    a: "No. Your content is never used to train base models. It's encrypted at rest and in transit, and stays scoped to your agent.",
    code: null,
    keywords: ["train", "privacy", "private", "secure", "encrypt", "gdpr", "model", "safe", "data"],
  },
  {
    chip: "Can I match my brand?",
    a: "Yes — colour, corner radius, avatar, name, position and welcome message. This bubble is using our own brand blue.",
    code: null,
    keywords: ["brand", "colour", "color", "custom", "look", "theme", "style", "avatar", "design"],
  },
  {
    chip: "How long is setup?",
    a: "Connect a source, give it a few minutes to read everything, then paste one line. Most teams are live within the hour.",
    code: null,
    keywords: ["long", "time", "quick", "fast", "start", "take", "hour", "minutes"],
  },
];

export const FALLBACK =
  "I'm a scripted demo, so I only know a handful of answers — try one of the suggestions. An agent trained on your own content would handle anything in it.";

export function answerFor(text: string): Msg {
  const q = text.toLowerCase();
  let best: (typeof DEMO_QA)[number] | null = null;
  let bestScore = 0;

  for (const item of DEMO_QA) {
    const score = item.keywords.filter((k) => q.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  return best
    ? { role: "agent", text: best.a, code: best.code }
    : { role: "agent", text: FALLBACK, code: null };
}
