// Saves or removes a phone's notification subscription and its chosen reminder hour.
const { sb, cors, body } = require("../lib/supa");

module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  try {
    const b = body(req);
    if (req.method === "DELETE") {
      if (!b.endpoint) return res.status(400).json({ error: "endpoint missing" });
      await sb("push_subs", "DELETE", null, null, `?endpoint=eq.${encodeURIComponent(b.endpoint)}`);
      return res.json({ ok: true });
    }
    if (req.method !== "POST") return res.status(405).end();
    const sub = b.subscription;
    const hour = parseInt(b.hour, 10);
    const offset = parseInt(b.offset, 10);
    if (!sub || !sub.endpoint || !sub.keys || !(hour >= 0 && hour <= 23) || !(offset >= -840 && offset <= 840)) {
      return res.status(400).json({ error: "bad request" });
    }
    await sb("push_subs", "POST", [{
      endpoint: sub.endpoint, p256dh: sub.keys.p256dh, auth: sub.keys.auth,
      hour, offset, last_sent: null
    }], "resolution=merge-duplicates", "?on_conflict=endpoint");
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "server error" });
  }
};
