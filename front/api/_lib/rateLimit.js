const buckets = new Map();

const WINDOW_MS = 60_000;
const MAX_REQUESTS = Number(process.env.AI_RATE_LIMIT_PER_MIN || 30);

function checkRateLimit(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip =
    (typeof forwarded === 'string' ? forwarded.split(',')[0]?.trim() : null) ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'anonymous';

  const now = Date.now();
  let bucket = buckets.get(ip);
  if (!bucket || now - bucket.start > WINDOW_MS) {
    bucket = { start: now, count: 0 };
    buckets.set(ip, bucket);
  }
  bucket.count += 1;

  if (bucket.count > MAX_REQUESTS) {
    return {
      ok: false,
      retryAfterSec: Math.ceil((WINDOW_MS - (now - bucket.start)) / 1000)
    };
  }
  return { ok: true };
}

module.exports = { checkRateLimit };
