# 🧠 Feynman AI

> Learn anything by teaching it to an AI.

![Feynman AI](https://elenaprojects.cc/og-feynman.png)

**Live:** https://feynman.elenaprojects.cc · **About:** https://elenaprojects.cc/feynman

The Feynman Technique says you only truly understand something when you can explain it simply. Feynman AI is your patient student: pick a topic and a persona — a curious child, a peer, or an expert — teach it out loud (or by text), and the AI asks **Socratic follow-up questions** that surface the parts you glossed over. When you're done, it scores your **fluency** and **subject mastery**, and saves each session so you can watch yourself improve.

## What's inside
- 🎙️ Teach by **voice** (Web Speech) or text
- ❓ **Socratic** questioning that probes exactly where your explanation is fuzzy
- 📊 Two-dimensional **fluency + mastery** score, with a progress history
- 📷 Reads a **photo of your notes** (multimodal)
- 🌏 English / 中文 · responsive on phone & desktop

## Tech
A single self-contained HTML / CSS / JS app · Google **Gemini** (multimodal) called through a small **Vercel serverless proxy** (`api/gemini.js`) so the API key never touches the browser · Web Speech API for voice. Deployed on **Vercel**.

## Run locally
The page calls a proxy at `/api/gemini`. Set `GEMINI_KEY` in your Vercel project's environment variables, then:
```bash
vercel dev
```
With no key it falls back to a built-in offline "demo brain".

---
Built by **Elena**, a high-school student in Shanghai — part of a learning-science & psychology portfolio. More at [elenaprojects.cc](https://elenaprojects.cc).
