# Networking Rehearsal

Practise a first professional conversation with your own assistant, the way you would practise speaking a new language.

It is a single-player version of a networking event where an agent makes the introductions. You join a practice event by writing three short answers. The assistant invents one other participant and shows you what you would see when introductions are ready: who you should meet, what they bring you, what you bring them, how to open, and your own answers underneath. You have the first conversation with the assistant playing that person, and get told what to change. Then you go again, with someone new, a harder mood, or better answers.

It runs inside your own ChatGPT (or other assistant) chat. Nothing is installed and there is no account. Nothing you say is sent to this project or its authors; the chat itself stays with your assistant's provider, under their terms.

## Start

Open the start page and tap the button: <https://tideseed.github.io/networking-rehearsal/>

Or send your assistant one of these sentences.

Türkçe:

```text
https://tideseed.github.io/networking-rehearsal/coach.txt adresini şimdi aç ve oradaki talimatlarla networking provamı yürüt. İlk mesajına o sayfada yazan sürüm numarasıyla başla, 1. adımdan devam et ve benimle Türkçe konuş. Sayfayı açamazsan tahmin yürütme, bana söyle.
```

English:

```text
Open https://tideseed.github.io/networking-rehearsal/coach.txt now and run it as my networking rehearsal, starting at step 1. Begin your first message with the version number written on that page. If you cannot open the page, tell me instead of guessing.
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
| `00-start.md` | What the assistant is asked to do, and the ground rules |
| `01-loop.md` | The six steps of a session |
| `02-join.md` | The practice event, the three answers, review and approval |
| `03-introduction.md` | The invented participant, the introduction card, your answers, and moods |
| `04-conversation.md` | How the practice conversation runs and ends |
| `05-debrief.md` | The five checks and the shape of the feedback |
| `06-example.md` | A short invented example |

## Changing the texts

Edit the files in `texts/`, raise `VERSION`, then:

```bash
node scripts/build.mjs
```

Commit `texts/` and `docs/` together. The page is served from `docs/` on the `main` branch.

Keep `coach.txt` short. Assistants skim long pages, and the loop has to be read before anything else.

## Status

First version. It has not yet been tested across ChatGPT plans; whether a free account reliably opens the page and runs it is the first thing to find out.
