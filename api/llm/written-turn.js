const { handleOptions, sendJson } = require('../_lib/cors');
const { checkRateLimit } = require('../_lib/rateLimit');
const { generateWrittenTurn } = require('../_lib/groqWritten');

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
      theme,
      locale = 'en',
      level = 'beginner',
      learnerRole = 'patient',
      learnerText = '',
      history = [],
      vocabulary = [],
      topicLabel = null,
      customPrompt = null,
      turnIndex = 0
    } = req.body || {};

    const cleanedTheme = String(theme || '').trim();
    if (!cleanedTheme) {
      return sendJson(
        req,
        res,
        { ok: false, error: { code: 'INVALID_THEME', message: 'theme required' } },
        400
      );
    }

    if (!['patient', 'doctor'].includes(learnerRole)) {
      return sendJson(
        req,
        res,
        { ok: false, error: { code: 'INVALID_ROLE', message: 'learnerRole must be patient or doctor' } },
        400
      );
    }

    const result = await generateWrittenTurn({
      theme: cleanedTheme.slice(0, 200),
      locale,
      level,
      learnerRole,
      learnerText: String(learnerText || '').slice(0, 2000),
      history: Array.isArray(history) ? history.slice(-20) : [],
      vocabulary: Array.isArray(vocabulary) ? vocabulary.slice(0, 80) : [],
      topicLabel: topicLabel ? String(topicLabel).slice(0, 120) : null,
      customPrompt,
      turnIndex: Number(turnIndex) || 0
    });

    if (result.error) {
      return sendJson(req, res, { ok: false, error: result.error }, result.error.status || 502);
    }
    return sendJson(req, res, { ok: true, data: result.data });
  } catch (err) {
    return sendJson(
      req,
      res,
      { ok: false, error: { code: 'INTERNAL', message: err.message || 'written turn failed' } },
      500
    );
  }
};
