const { handleOptions, sendJson } = require('../_lib/cors');
const { checkRateLimit } = require('../_lib/rateLimit');
const { transcribeAudio } = require('../_lib/deepgram');

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
    const { audioBase64, mimeType = 'audio/webm', language = 'en' } = req.body || {};
    if (!audioBase64 || typeof audioBase64 !== 'string') {
      return sendJson(
        req,
        res,
        { ok: false, error: { code: 'INVALID_AUDIO', message: 'audioBase64 required' } },
        400
      );
    }
    if (audioBase64.length > 5_500_000) {
      return sendJson(
        req,
        res,
        { ok: false, error: { code: 'INVALID_AUDIO', message: 'Audio too large' } },
        413
      );
    }

    const audioBuffer = Buffer.from(audioBase64, 'base64');
    const result = await transcribeAudio({ audioBuffer, mimeType, language });
    if (result.error) {
      return sendJson(req, res, { ok: false, error: result.error }, result.error.status || 502);
    }
    return sendJson(req, res, { ok: true, data: result.data });
  } catch (err) {
    return sendJson(
      req,
      res,
      { ok: false, error: { code: 'INTERNAL', message: err.message || 'transcribe failed' } },
      500
    );
  }
};

module.exports.config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb'
    }
  }
};
