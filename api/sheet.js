// Vercel serverless function: fetches the live Google Sheet as CSV (avoids CORS issues).
const SHEET_ID = process.env.SHEET_ID || "10-WB1knnAnHHV21t7pTiN5rMPYA5WD9QATK12sjx2Sk";
const GID = process.env.SHEET_GID || "0";

module.exports = async (req, res) => {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}&t=${Date.now()}`;
    const r = await fetch(url, { redirect: "follow" });
    if (!r.ok) throw new Error("Sheet responded " + r.status);
    const text = await r.text();
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=5, stale-while-revalidate=10");
    res.status(200).send(text);
  } catch (e) {
    res.status(502).json({ error: String(e.message || e) });
  }
};
