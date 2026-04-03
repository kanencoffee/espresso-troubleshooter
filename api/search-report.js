import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Simple auth — require a secret query param to prevent public access
  const secret = req.query.secret;
  if (secret !== process.env.REPORT_SECRET) {
    return res.status(401).json({ error: 'Unauthorized — add ?secret=YOUR_REPORT_SECRET' });
  }

  try {
    const view = req.query.view || 'no_results'; // no_results | all | daily
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);

    if (view === 'no_results') {
      // Top searches that returned zero results — this is your content gap list
      const terms = await kv.zrange('search:terms:no_results', 0, limit - 1, { rev: true, withScores: true });

      const rows = [];
      for (let i = 0; i < terms.length; i += 2) {
        rows.push({ query: terms[i], count: terms[i + 1] });
      }

      return res.status(200).json({
        view: 'no_results',
        description: 'Searches that found zero matching issues — content gaps to fill',
        total: rows.length,
        data: rows,
      });
    }

    if (view === 'all') {
      // Top search terms overall
      const terms = await kv.zrange('search:terms:all', 0, limit - 1, { rev: true, withScores: true });

      const rows = [];
      for (let i = 0; i < terms.length; i += 2) {
        rows.push({ query: terms[i], count: terms[i + 1] });
      }

      return res.status(200).json({
        view: 'all',
        description: 'All search terms ranked by frequency',
        total: rows.length,
        data: rows,
      });
    }

    if (view === 'daily') {
      // Raw search log for a specific day
      const date = req.query.date || new Date().toISOString().slice(0, 10);
      const entries = await kv.lrange(`searches:${date}`, 0, limit - 1);

      const parsed = entries.map((e) => (typeof e === 'string' ? JSON.parse(e) : e));

      return res.status(200).json({
        view: 'daily',
        date,
        total: parsed.length,
        data: parsed,
      });
    }

    return res.status(400).json({ error: 'Invalid view. Use: no_results, all, or daily' });
  } catch (err) {
    console.error('search-report error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
