// Called every 15 minutes by a free cron service (see steps). Sends the reminder to phones whose local hour matches.
const webpush = require("web-push");
const { sb } = require("../lib/supa");

module.exports = async (req, res) => {
  if (!process.env.CRON_SECRET || req.query.key !== process.env.CRON_SECRET) return res.status(401).end();
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:admin@example.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  const now = new Date();
  const subs = await sb("push_subs", "GET", null, null, "?select=*");
  let sent = 0;
  for (const s of subs) {
    const local = new Date(now.getTime() + s.offset * 60000);
    const today = local.toISOString().slice(0, 10);
    if (local.getUTCHours() !== s.hour || local.getUTCMinutes() >= 30 || s.last_sent === today) continue;
    const ep = `?endpoint=eq.${encodeURIComponent(s.endpoint)}`;
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        JSON.stringify({ title: "O-E Adventure", body: "Aaj ka paath baaki hai! 5 minute kaafi hai. 🔥", url: "/" })
      );
      await sb("push_subs", "PATCH", { last_sent: today }, null, ep);
      sent++;
    } catch (e) {
      if (e.statusCode === 404 || e.statusCode === 410) await sb("push_subs", "DELETE", null, null, ep);
    }
  }
  res.json({ checked: subs.length, sent });
};
