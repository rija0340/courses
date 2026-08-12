const { handleOptions, sendJson } = require('../_lib/cors');
const { checkRateLimit } = require('../_lib/rateLimit');
const { generateSimulation } = require('../_lib/groq');

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
      customPrompt = null,
      promptId = null,
      turns = 12,
      level = 'beginner',
      vocabulary = [],
      topicLabel = null,
      length = 'long',
      scenarioKind = 'general',
      roles = null
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

    const vocab = Array.isArray(vocabulary) ? vocabulary.slice(0, 80) : [];
    const kind = scenarioKind === 'medical' ? 'medical' : 'general';

    const result = await generateSimulation({
      theme: cleanedTheme.slice(0, 200),
      locale,
      customPrompt,
      promptId,
      turns,
      level,
      vocabulary: vocab,
      topicLabel: topicLabel ? String(topicLabel).slice(0, 120) : null,
      length,
      scenarioKind: kind,
      roles: roles && typeof roles === 'object' ? roles : null
    });

    if (result.error) {
      return sendJson(req, res, { ok: false, error: result.error }, result.error.status || 502);
    }
    return sendJson(req, res, { ok: true, data: result.data });
  } catch (err) {
    return sendJson(
      req,
      res,
      { ok: false, error: { code: 'INTERNAL', message: err.message || 'generate failed' } },
      500
    );
  }
};
