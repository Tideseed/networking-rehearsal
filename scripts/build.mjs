// Joins texts/*.md into the one page an assistant opens, and writes the
// start page with the prefilled links. No dependencies; run with `node`.
// Output is deterministic: the version comes from VERSION, not the clock.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE_URL = "https://tideseed.github.io/networking-rehearsal";
const version = readFileSync(join(root, "VERSION"), "utf8").trim();
// The version rides in the address: ChatGPT keeps its own copy of a page it
// has opened before, and served 0.3.0 for the bare address while 0.5.0 was live.
const COACH_URL = `${BASE_URL}/coach.txt?v=${version}`;
const parts = readdirSync(join(root, "texts"))
  .filter((name) => name.endsWith(".md"))
  .sort()
  .map((name) => readFileSync(join(root, "texts", name), "utf8").trim());

const [first, ...rest] = parts;
const [title, ...intro] = first.split("\n");
const coach = [
  title,
  "",
  `Version ${version}. Source: https://github.com/Tideseed/networking-rehearsal`,
  ...intro,
  "",
  ...rest.flatMap((part) => [part, ""]),
]
  .join("\n")
  .trimEnd() + "\n";

// One sentence for every language: the assistant picks the user's language
// itself, so the sentence is not translated.
export const START_PROMPT = `Open ${COACH_URL} now and run the networking simulation it describes, from step 1, in my native language (the language I normally use with you; if you cannot tell, ask me first). Begin your first message with the version number written on that page. If you cannot open the page, tell me instead of guessing.`;

const chatgptLink = (prompt) =>
  `https://chatgpt.com/?q=${encodeURIComponent(prompt)}&hints=search`;

const escapeHtml = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const block = (heading, prompt, button, fallback) => `
    <section>
      <h2>${heading}</h2>
      <p><a class="go" href="${escapeHtml(chatgptLink(prompt))}">${button}</a></p>
      <p>${fallback}</p>
      <pre>${escapeHtml(prompt)}</pre>
    </section>`;

const index = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Networking Rehearsal</title>
    <style>
      body { font: 16px/1.5 system-ui, sans-serif; max-width: 40rem; margin: 0 auto; padding: 1.5rem 1rem; color: #1a1a1a; background: #fff; }
      h1 { font-size: 1.5rem; } h2 { font-size: 1.1rem; margin-top: 2rem; }
      pre { white-space: pre-wrap; word-break: break-word; background: #f3f3f3; padding: .75rem; border-radius: 6px; font-size: .9rem; }
      a.go { display: inline-block; padding: .6rem 1rem; border-radius: 6px; background: #1a1a1a; color: #fff; text-decoration: none; }
      @media (prefers-color-scheme: dark) { body { color: #eee; background: #161616; } pre { background: #262626; } a.go { background: #eee; color: #161616; } a { color: #9cc4ff; } }
    </style>
  </head>
  <body>
    <h1>Networking Rehearsal</h1>
    <p>Practise a first professional conversation with your own assistant, the way you would practise speaking a new language. A training simulation between you and your own assistant, which plays your match: someone you have just been introduced to. It drafts your profile, you choose who the match is, you carry the conversation, and it tells you what to change. Version ${escapeHtml(version)}.</p>${block(
      "Start",
      START_PROMPT,
      "Start in ChatGPT",
      "It runs in your own language. If the link does not work, copy this sentence into your assistant:",
    )}
    <h2>If the assistant cannot open the page</h2>
    <p>Open <a href="coach.txt">coach.txt</a>, copy all of it, and paste it into the chat.</p>
    <p><a href="https://github.com/Tideseed/networking-rehearsal">Source and texts</a></p>
  </body>
</html>
`;

mkdirSync(join(root, "docs"), { recursive: true });
writeFileSync(join(root, "docs", "coach.txt"), coach);
writeFileSync(join(root, "docs", "index.html"), index);
writeFileSync(join(root, "docs", ".nojekyll"), "");

const readmePath = join(root, "README.md");
const readme = readFileSync(readmePath, "utf8").replace(
  /coach\.txt(\?v=[0-9.]+)?(?= now)/g,
  `coach.txt?v=${version}`,
);
writeFileSync(readmePath, readme);

const words = coach.split(/\s+/).filter(Boolean).length;
console.log(`coach.txt: ${words} words, ${coach.length} characters, version ${version}`);
console.log(`link: ${chatgptLink(START_PROMPT).length} characters`);
