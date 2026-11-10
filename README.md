# Networking Rehearsal

Practise a first professional conversation with your own assistant, the way you would practise speaking a new language.

It is a training simulation between you and your own AI assistant, which plays your **match**: someone you have just been introduced to at an event where people tend to network.

1. Your assistant drafts your profile as three short answers from what it already knows about you, and you approve it.
2. You choose the match's persona (a customer, someone a step ahead of you, someone who can open a door, or anyone you describe) and their mood.
3. You see the introduction: who the match is, what they bring you, what you bring them, how to open, and your own answers underneath.
4. You carry the conversation yourself, in text or by voice. The assistant only plays the match.
5. It tells you what worked and what to change, and you go again.

You always take part as yourself; only the match is invented.

The format follows [AgentsIntro](https://agentsintro.com), which makes introductions like these between real people at real events. This repository is not connected to it: nothing here signs you up, and nothing is sent there.

It runs inside your own ChatGPT (or other assistant) chat. Nothing is installed and there is no account. Nothing you say is sent to this project or its authors; the chat itself stays with your assistant's provider, under their terms.

## Start

Open the start page and tap the button: <https://tideseed.github.io/networking-rehearsal/>

Or send your assistant one of these sentences.

Türkçe:

```text
https://tideseed.github.io/networking-rehearsal/coach.txt?v=0.7.2 adresini şimdi aç ve oradaki talimatlarla networking provamı yürüt. İlk mesajına o sayfada yazan sürüm numarasıyla başla, 1. adımdan devam et ve benimle Türkçe konuş. Sayfayı açamazsan tahmin yürütme, bana söyle.
```

English:

```text
Open https://tideseed.github.io/networking-rehearsal/coach.txt?v=0.7.2 now and run it as my networking rehearsal, starting at step 1. Begin your first message with the version number written on that page. If you cannot open the page, tell me instead of guessing.
```

If the assistant cannot open the page, open [coach.txt](https://tideseed.github.io/networking-rehearsal/coach.txt) yourself, copy all of it, and paste it into the chat.

To practise by voice, send the sentence as text first, then switch the same chat to voice.

## What is in here

| Path | What it is |
| --- | --- |
| `texts/` | The training texts, one file per part of the session |
| `docs/coach.txt` | All of them joined into the one page the assistant opens |
| `docs/index.html` | The start page with the prefilled links |
| `scripts/build.mjs` | Builds `docs/` from `texts/` |
| `VERSION` | The version printed at the top of `coach.txt` |

| Text | Part of the session |
| --- | --- |
| `00-start.md` | The two parties, user and match, and the rules for the whole session |
| `01-profile.md` | The prompt that drafts the user's three answers, and their approval |
| `02-match.md` | Choosing the match's persona, judging the pair, the introduction |
| `03-conversation.md` | How the match behaves and how a round ends |
| `04-debrief.md` | The feedback, going again, and the closing line |

## Changing the texts

Edit the files in `texts/`, raise `VERSION`, then:

```bash
node scripts/build.mjs
```

The build also puts the new version into the start sentences, here and on the start page, as `coach.txt?v=<version>`. Assistants keep their own copy of a page they have opened before, and the version in the address is what makes them fetch the new one. Commit `texts/`, `docs/` and `README.md` together. The page is served from `docs/` on the `main` branch.

Keep `coach.txt` short. Assistants skim long pages, and the loop has to be read before anything else.

## Status

First version. It has not yet been tested across ChatGPT plans; whether a free account reliably opens the page and runs it is the first thing to find out.
