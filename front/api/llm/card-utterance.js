const { handleOptions, sendJson } = require('../_lib/cors');
const { checkRateLimit } = require('../_lib/rateLimit');
const { assessCardUtterance } = require('../_lib/groqCardUtterance');

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
    const {
      learnerText = '',
      headword = '',
      related = [],
      meaningFr = '',
      meaningMg = '',
      context = '',
      exampleEn = [],
      detectedUsed = [],
      detectedMissed = []
    } = req.body || {};

    const text = String(learnerText || '').trim();
    const word = String(headword || '').trim();
    if (!text) {
      return sendJson(
        req,
        res,
        { ok: false, error: { code: 'INVALID', message: 'learnerText required' } },
        400
      );
    }
    if (!word) {
      return sendJson(
        req,
        res,
        { ok: false, error: { code: 'INVALID', message: 'headword required' } },
        400
      );
    }

    const result = await assessCardUtterance({
      learnerText: text.slice(0, 2000),
      headword: word.slice(0, 120),
      related: Array.isArray(related) ? related.slice(0, 40) : [],
      meaningFr: String(meaningFr || '').slice(0, 200),
      meaningMg: String(meaningMg || '').slice(0, 200),
      context: String(context || '').slice(0, 400),
      exampleEn: Array.isArray(exampleEn) ? exampleEn.map((e) => String(e).slice(0, 400)).slice(0, 6) : [],
      detectedUsed: Array.isArray(detectedUsed) ? detectedUsed.slice(0, 20) : [],
      detectedMissed: Array.isArray(detectedMissed) ? detectedMissed.slice(0, 20) : []
    });

    if (result.error) {
      return sendJson(req, res, { ok: false, error: result.error }, result.error.status || 502);
    }
    return sendJson(req, res, { ok: true, data: result.data });
  } catch (err) {
    return sendJson(
      req,
      res,
      { ok: false, error: { code: 'INTERNAL', message: err.message || 'card utterance failed' } },
      500
    );
  }
};
