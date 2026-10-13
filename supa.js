// Shared helpers for the Vercel API routes. Keys come from Vercel environment variables only.
const URL_ = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_KEY;

async function sb(table, method, body, prefer, query) {
  const r = await fetch(`${URL_}/rest/v1/${table}${query || ""}`, {
    method,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`${r.status} ${text}`);
  return text ? JSON.parse(text) : null;
}

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function body(req) {
  return typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
}

module.exports = { sb, cors, body };
