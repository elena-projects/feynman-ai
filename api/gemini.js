// ============================================================
// Feynman AI — Gemini proxy (Vercel Serverless Function)
// Path: after deploying it is  https://your-project.vercel.app/api/gemini
// Purpose: keep the Gemini key hidden on the server side. The web page only calls this
//          function, and the function then calls Gemini with the key.
// The key is read from the GEMINI_KEY environment variable (add it in the Vercel project settings, don't write it into the code).
// ============================================================

export default async function handler(req, res) {
  // CORS: allow web pages (including cross-origin) to call
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(200).send("Feynman AI proxy ✅");

  const KEY = process.env.GEMINI_KEY;
  if (!KEY) return res.status(500).json({ error: "Server is missing GEMINI_KEY env var." });

  try {
    // Vercel may have already parsed the JSON body into an object, so convert it back to a string before forwarding
    const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
    // The client can pick the model via ?model= (e.g. the neural-TTS model). Default to flash; only allow gemini-* names.
    const reqModel = (req.query && req.query.model) ? String(req.query.model) : "gemini-2.5-flash";
    const model = /^gemini-[a-z0-9.\-]+$/i.test(reqModel) ? reqModel : "gemini-2.5-flash";
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + KEY;

    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const text = await upstream.text();
    res.status(upstream.status).setHeader("Content-Type", "application/json").send(text);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
