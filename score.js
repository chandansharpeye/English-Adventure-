// Leaderboard: GET returns top 20. POST saves a nickname's best XP (never lowers it).
const { sb, cors, body } = require("../lib/supa");

module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  try {
    if (req.method === "GET") {
      const rows = await sb("scores", "GET", null, null, "?select=nick,xp&order=xp.desc&limit=20");
      return res.json(rows);
    }
    if (req.method !== "POST") return res.status(405).end();
    const b = body(req);
    const nick = String(b.nick || "").replace(/[^\p{L}\p{N} _-]/gu, "").trim().slice(0, 16);
    const xp = parseInt(b.xp, 10);
    if (nick.length < 2 || !(xp >= 0 && xp <= 50000)) return res.status(400).json({ error: "bad request" });
    const cur = await sb("scores", "GET", null, null, `?nick=eq.${encodeURIComponent(nick)}&select=xp`);
    if (!cur.length || xp > cur[0].xp) {
      await sb("scores", "POST", [{ nick, xp, updated_at: new Date().toISOString() }],
        "resolution=merge-duplicates", "?on_conflict=nick");
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "server error" });
  }
};
