// Joins texts/*.md into the one page an assistant opens, and writes the
// start page with the prefilled link. No dependencies; run with `node`.
// Output is deterministic: the version comes from VERSION, not the clock.
// The sharing image docs/og.png is drawn from assets/og.svg by hand:
//   rsvg-convert -w 1200 -h 630 assets/og.svg -o docs/og.png
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

const SHARE_TITLE = "Networking Rehearsal";
const SHARE_TEXT =
  "Practise a first professional conversation with your own ChatGPT. It plays the person you were just introduced to, then tells you what to change. Everything stays in your chat.";

const index = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${SHARE_TITLE}</title>
    <meta name="description" content="${escapeHtml(SHARE_TEXT)}">
    <link rel="canonical" href="${BASE_URL}/">
    <link rel="icon" href="icon.svg" type="image/svg+xml">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${SHARE_TITLE}">
    <meta property="og:title" content="${SHARE_TITLE}: practise a first conversation with your own AI">
    <meta property="og:description" content="${escapeHtml(SHARE_TEXT)}">
    <meta property="og:url" content="${BASE_URL}/">
    <meta property="og:image" content="${BASE_URL}/og.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Networking Rehearsal. Practise a first conversation with your own ChatGPT. Everything stays in your chat.">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${SHARE_TITLE}">
    <meta name="twitter:description" content="${escapeHtml(SHARE_TEXT)}">
    <meta name="twitter:image" content="${BASE_URL}/og.png">
    <meta name="theme-color" content="#6f263d">
    <style>
      /* Colours follow agentsintro.com. */
      :root { --bg: #f7f5f1; --ink: #171717; --soft: #6f6b65; --line: rgba(23, 23, 23, 0.16); --card: #fcfbf8; --accent: #6f263d; --on-accent: #fbf7f4; --safe-bg: #f3e7ea; --safe-ink: #5b1f32; }
      @media (prefers-color-scheme: dark) { :root { --bg: #1d1719; --ink: #efeae1; --soft: #a89f94; --line: rgba(239, 234, 225, 0.2); --card: #251e20; --accent: #c4677c; --on-accent: #2a1218; --safe-bg: #33262a; --safe-ink: #efeae1; } }
      * { box-sizing: border-box; }
      body { margin: 0; font: 17px/1.55 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--ink); background: var(--bg); }
      main { max-width: 38rem; margin: 0 auto; padding: 2rem 1rem 1.5rem; }
      h1 { font-size: clamp(1.8rem, 6vw, 2.4rem); line-height: 1.1; margin: 0 0 .5rem; letter-spacing: -.02em; }
      h2 { font-size: 1.05rem; margin: 1.5rem 0 .4rem; }
      p { margin: 0 0 .7rem; }
      .lead { font-size: 1.05rem; color: var(--soft); }
      a { color: inherit; }
      .go { display: inline-block; margin-top: .5rem; padding: .8rem 1.3rem; border-radius: 999px; background: var(--accent); color: var(--on-accent); text-decoration: none; font-weight: 600; }
      .note { font-size: .92rem; color: var(--soft); margin-top: .75rem; }
      .safe { margin-top: 1.25rem; padding: .8rem 1rem; border-radius: 12px; background: var(--safe-bg); color: var(--safe-ink); }
      .safe h2 { margin: 0 0 .2rem; }
      .safe p { margin: 0; }
      .safe ul { margin: 0; padding-left: 1.15rem; }
      .safe li { margin-bottom: .35rem; }
      .safe .note { color: inherit; opacity: .8; margin-bottom: 0; }
      ol.steps { margin: 0; padding: 0; list-style: none; counter-reset: step; }
      ol.steps li { counter-increment: step; position: relative; padding: .35rem 0 .35rem 2rem; color: var(--soft); }
      ol.steps li::before { content: counter(step); position: absolute; left: 0; top: .4rem; width: 1.4rem; height: 1.4rem; border-radius: 50%; border: 1px solid var(--line); text-align: center; line-height: 1.35rem; font-size: .8rem; color: var(--soft); }
      ol.steps b { color: var(--ink); }
      pre { white-space: pre-wrap; word-break: break-word; margin: 0 0 .6rem; padding: .7rem .85rem; border-radius: 10px; border: 1px solid var(--line); background: var(--card); font: .8rem/1.45 ui-monospace, SFMono-Regular, Menlo, monospace; }
      button { font: inherit; font-size: .92rem; padding: .45rem .9rem; border-radius: 999px; border: 1px solid var(--line); background: var(--card); color: var(--ink); cursor: pointer; }
      dialog { max-width: 26rem; width: calc(100% - 2rem); padding: 1.25rem; border: 1px solid var(--line); border-radius: 14px; background: var(--card); color: var(--ink); }
      dialog::backdrop { background: rgba(23, 23, 23, 0.5); }
      dialog h2 { margin: 0 0 .5rem; font-size: 1.2rem; }
      dialog .actions { display: flex; flex-wrap: wrap; gap: .6rem; justify-content: flex-end; align-items: center; margin-top: 1rem; }
      dialog .go { margin-top: 0; padding: .6rem 1.1rem; }
      dialog button { padding: .6rem 1.1rem; }
      dialog .alt { margin: .9rem 0 0; text-align: right; font-size: .92rem; color: var(--soft); }
      html { scroll-behavior: smooth; }
      footer { margin-top: 1.5rem; padding-top: .8rem; border-top: 1px solid var(--line); font-size: .92rem; color: var(--soft); }
    </style>
  </head>
  <body>
    <main>
      <h1>Networking Rehearsal</h1>
      <p class="lead">Practise a first professional conversation with your own ChatGPT, the way you would practise speaking a new language. It plays the person you were just introduced to. You do the talking. Then it tells you what to change.</p>
      <p><a class="go" id="start" href="${escapeHtml(chatgptLink(START_PROMPT))}">Start in ChatGPT</a></p>
      <p class="note">About ten minutes, in your own language, by text or voice. No account and nothing to install.</p>

      <section class="safe">
        <h2>It stays in your chat</h2>
        <p>Nothing you write is sent to us or to anyone else. Your rehearsal lives only in your own ChatGPT chat, like any other chat of yours.</p>
      </section>

      <h2>How it goes</h2>
      <ol class="steps">
        <li><b>Profile.</b> ChatGPT drafts three short answers about you; you approve them.</li>
        <li><b>Match.</b> You choose who to meet and their mood.</li>
        <li><b>Introduction.</b> Who they are, why you two should talk, how to open.</li>
        <li><b>Conversation.</b> You speak for yourself; ChatGPT plays the match.</li>
        <li><b>Debrief.</b> What worked and what to change. Then go again.</li>
      </ol>

      <h2 id="send">Or send this sentence yourself</h2>
            <pre id="prompt">${escapeHtml(START_PROMPT)}</pre>
      <button type="button" id="copy">Copy</button>
      <p class="note">Works in any language; web search must be on. If ChatGPT cannot open the page, paste <a href="coach.txt">the instructions</a> into the chat.</p>

      <footer>
        <p>The format follows <a href="https://agentsintro.com">AgentsIntro</a>, which does this between real people at real events; this rehearsal is not connected to it. Version ${escapeHtml(version)} · <a href="coach.txt">instructions</a> · <a href="https://github.com/Tideseed/networking-rehearsal">source</a></p>
      </footer>
    </main>
    <dialog id="confirm" aria-labelledby="confirm-title">
      <h2 id="confirm-title">You are in control</h2>
      <p>This button takes you to your own ChatGPT and puts a prompt in the message box. Nothing is sent or done automatically: read the prompt, then press send yourself when you are ready.</p>
      <div class="actions">
        <button type="button" id="cancel">Cancel</button>
        <a class="go" href="${escapeHtml(chatgptLink(START_PROMPT))}">Continue to ChatGPT</a>
      </div>
      <p class="alt"><a href="#send" id="instead">Copy the prompt instead</a></p>
    </dialog>
    <script>
      (function () {
        var dialog = document.getElementById("confirm");
        if (!dialog || !dialog.showModal) return;
        document.getElementById("start").addEventListener("click", function (event) {
          event.preventDefault();
          dialog.showModal();
        });
        document.getElementById("cancel").addEventListener("click", function () { dialog.close(); });
        dialog.addEventListener("click", function (event) { if (event.target === dialog) dialog.close(); });
        document.getElementById("instead").addEventListener("click", function () { dialog.close(); });
        dialog.querySelector("a.go").addEventListener("click", function () { dialog.close(); });
      })();
      document.getElementById("copy").addEventListener("click", function () {
        var button = this;
        navigator.clipboard.writeText(document.getElementById("prompt").textContent).then(function () {
          button.textContent = "Copied";
          setTimeout(function () { button.textContent = "Copy"; }, 1500);
        });
      });
    </script>
  </body>
</html>
`;

const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#6f263d"/><circle cx="24" cy="32" r="11" fill="#f3e7ea"/><circle cx="40" cy="32" r="11" fill="none" stroke="#f3e7ea" stroke-width="3" stroke-dasharray="5 4"/></svg>
`;

mkdirSync(join(root, "docs"), { recursive: true });
writeFileSync(join(root, "docs", "coach.txt"), coach);
writeFileSync(join(root, "docs", "index.html"), index);
writeFileSync(join(root, "docs", "icon.svg"), icon);
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
