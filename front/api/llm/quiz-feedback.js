const { handleOptions, sendJson } = require('../_lib/cors');
const { checkRateLimit } = require('../_lib/rateLimit');
const { generateQuizFeedback } = require('../_lib/groqQuiz');

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
      exerciseType = 'definition_to_word',
      prompt = '',
      expected = '',
      learnerAnswer = '',
      theme = '',
      vocabulary = [],
      level = 'beginner'
    } = req.body || {};

    if (!String(prompt || '').trim() && !String(expected || '').trim()) {
      return sendJson(
        req,
        res,
        { ok: false, error: { code: 'INVALID', message: 'prompt or expected required' } },
        400
      );
    }

    const result = await generateQuizFeedback({
      exerciseType,
      prompt: String(prompt).slice(0, 2000),
      expected: String(expected).slice(0, 500),
      learnerAnswer: String(learnerAnswer || '').slice(0, 2000),
      theme: String(theme || '').slice(0, 200),
      vocabulary: Array.isArray(vocabulary) ? vocabulary.slice(0, 80) : [],
      level
    });

    if (result.error) {
      return sendJson(req, res, { ok: false, error: result.error }, result.error.status || 502);
    }
    return sendJson(req, res, { ok: true, data: result.data, usage: result.usage || null });
  } catch (err) {
    return sendJson(
      req,
      res,
      { ok: false, error: { code: 'INTERNAL', message: err.message || 'quiz feedback failed' } },
      500
    );
  }
};
