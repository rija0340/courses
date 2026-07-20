const { handleOptions, sendJson } = require('../_lib/cors');
const { checkRateLimit } = require('../_lib/rateLimit');
const { synthesizeSpeech } = require('../_lib/deepgram');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return handleOptions(req, res);
  }
  if (req.method !== 'POST') {
    return sendJson(req, res, { ok: false, error: { code: 'METHOD', message: 'POST only' } }, 405);
  }

  const limit = checkRateLimit(req);
  if (!limit.ok) {
    return sendJson(
      req,
      res,
      {
        ok: false,
        error: {
          code: 'QUOTA',
          message: 'Too many requests',
          details: { retryAfterSec: limit.retryAfterSec }
        }
      },
      429
    );
  }

  try {
    const { text, model } = req.body || {};
    const cleaned = String(text || '').trim();
    if (!cleaned) {
      return sendJson(
        req,
        res,
        { ok: false, error: { code: 'INVALID_TEXT', message: 'text required' } },
        400
      );
    }
    if (cleaned.length > 2000) {
      return sendJson(
        req,
        res,
        { ok: false, error: { code: 'INVALID_TEXT', message: 'text too long' } },
        400
      );
    }

    const result = await synthesizeSpeech({ text: cleaned, model });
    if (result.error) {
      return sendJson(req, res, { ok: false, error: result.error }, result.error.status || 502);
    }
    return sendJson(req, res, { ok: true, data: result.data });
  } catch (err) {
    return sendJson(
      req,
      res,
      { ok: false, error: { code: 'INTERNAL', message: err.message || 'speak failed' } },
      500
    );
  }
};
