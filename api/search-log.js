import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // CORS for same-origin fetch
  res.setHeader('Access-Control-Allow-Origin', 'https://help.kanencoffee.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { query, resultCount, filters } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Missing query' });
    }

    const normalized = query.trim().toLowerCase();
    if (normalized.length < 2) {
      return res.status(400).json({ error: 'Query too short' });
    }

    const entry = {
      query: normalized,
      originalQuery: query.trim(),
      resultCount: resultCount ?? null,
      filters: filters ?? {},
      timestamp: new Date().toISOString(),
    };

    // Store in a sorted set keyed by date for easy retrieval
    const dateKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // 1. Append to daily log (list)
    await kv.lpush(`searches:${dateKey}`, JSON.stringify(entry));

    // 2. Increment search term counter (sorted set — score = count)
    await kv.zincrby('search:terms:all', 1, normalized);

    // 3. If no results, also track in a separate sorted set
    if (resultCount === 0) {
      await kv.zincrby('search:terms:no_results', 1, normalized);
    }

    // 4. Set TTL on daily lists (90 days)
    await kv.expire(`searches:${dateKey}`, 90 * 24 * 60 * 60);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('search-log error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
