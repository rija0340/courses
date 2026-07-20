const DEFAULT_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

function allowedOrigins() {
  const fromEnv = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return fromEnv.length ? fromEnv : DEFAULT_ORIGINS;
}

function requestOrigin(req) {
  return req.headers.origin || req.headers.Origin || '';
}

function applyCors(req, res) {
  const origin = requestOrigin(req);
  const allowed = allowedOrigins();
  const match = allowed.includes('*')
    ? '*'
    : allowed.includes(origin)
      ? origin
      : allowed[0];

  res.setHeader('Access-Control-Allow-Origin', match);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');
}

function handleOptions(req, res) {
  applyCors(req, res);
  res.statusCode = 204;
  res.end();
}

function sendJson(req, res, body, status = 200) {
  applyCors(req, res);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

module.exports = { applyCors, handleOptions, sendJson };
