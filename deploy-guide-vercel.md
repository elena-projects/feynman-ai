# Launch with Vercel (no server, no ICP filing)

> Goal: get a URL that classmates can just open and use, **without each needing their own key**, with your key **hidden on the server side and never exposed**.
> The whole thing is free, no credit card needed. Estimated 20 minutes.
> ⚠️ Heads-up: Vercel **may not open / may be unstable in mainland China**; it's fine for people overseas and anyone with normal access. To truly guarantee access from within China without a VPN, you'd have to go the "domestic server + ICP filing" route, which is a different path.

---

## What the folder you need to prepare looks like

```
your-project-folder/
├── index.html          ← copy feynman-ai-app-v1.html over and rename it to index.html
└── api/
    └── gemini.js       ← already written for you (this is vercel-deploy/api/gemini.js)
```

**Two things to do first:**
1. Make a copy of `feynman-ai-app-v1.html`, rename it to **`index.html`**, and put it in the folder root.
2. Open this `index.html`, search for `var PROXY_URL='';`, and change it to:
   ```js
   var PROXY_URL='/api/gemini';
   ```
   (Once this is filled in, everyone who opens it automatically goes through the proxy, and no one needs to enter a key.)

---

## Step 1: Get a free Gemini key (about 2 minutes)

Open **https://aistudio.google.com** → sign in → **Get API key** on the left → **Create API key** → copy and save.
(This key **only goes into Vercel's environment variable** — don't write it into the code, don't send it to anyone.)

---

## Step 2: Deploy to Vercel (the web-based approach is recommended; no installs needed)

### Option A: GitHub + Vercel web (best for beginners, entirely in the browser)
1. Sign up at **https://github.com**, create a new repository, and upload the contents of the folder above
   (`index.html` and `api/gemini.js`, keeping the `api/` subfolder structure).
2. Sign up at **https://vercel.com** (signing in with your GitHub account is fastest).
3. Click **Add New → Project**, select the repo you just created, and click **Import**.
4. **The crucial step: add the key.** On the import page (or under Project → Settings → Environment Variables):
   - For Name, enter **`GEMINI_KEY`** (exactly)
   - For Value, paste the Gemini key from Step 1
   - Save.
5. Click **Deploy**, wait a bit, and get a URL like **`https://your-project.vercel.app`**.

### Option B: Vercel command line (only if Node is installed on your computer)
```bash
npm i -g vercel
cd your-project-folder
vercel              # follow the prompts to log in and confirm; gives you a preview URL
vercel env add GEMINI_KEY      # paste the key, select all three environments
vercel --prod       # publish for real
```

---

## Step 3: Test

1. Open **`https://your-project.vercel.app/api/gemini`**; seeing "Feynman AI proxy ✅" → the proxy is alive.
2. Open **`https://your-project.vercel.app`** and go teach a lesson. The real AI model, image upload, voice, and scoring should all run online, **without needing a key**.

---

## FAQ
- **The page opens but the AI doesn't respond?** Most likely `GEMINI_KEY` isn't set or is misspelled. Go to Vercel → Settings → Environment Variables to check, and after changing it you need to **Redeploy** once.
- **How do I update after editing index.html?** Re-upload to GitHub (or run `vercel --prod` again), and Vercel will automatically republish.
- **Quota?** The Gemini free tier is roughly 1,500 requests per day, enough for small-scale testing.
- **Can't open it in China?** This is caused by Vercel itself being unstable in China, not a configuration error on your part — the only real fix is the domestic server + ICP filing route.

---

If you need it, I'll walk you through it step by step: tell me where you are and where you're stuck, and send a screenshot.
