const { handleOptions, sendJson } = require('../_lib/cors');
const { getAiHealth } = require('../_lib/aiHealth');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return handleOptions(req, res);
  }
  if (req.method !== 'GET') {
    return sendJson(req, res, { ok: false, error: { code: 'METHOD', message: 'GET only' } }, 405);
  }

  try {
    const health = await getAiHealth();
    return sendJson(req, res, { ok: true, data: health });
  } catch (err) {
    return sendJson(
      req,
      res,
      { ok: false, error: { code: 'INTERNAL', message: err.message || 'health check failed' } },
      500
    );
  }
};
