/**
 * Local API gateway for Practice (Deepgram / Groq).
 * Loads secrets from .env — no Vercel login required for local dev.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, 'utf8');
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(root, '.env'));
loadEnvFile(path.join(root, '.env.local'));

const transcribe = require('../api/speech/transcribe');
const speak = require('../api/speech/speak');
const generate = require('../api/llm/generate');
const writtenTurn = require('../api/llm/written-turn');
const quizFeedback = require('../api/llm/quiz-feedback');
const aiHealth = require('../api/ai/health');

const PORT = Number(process.env.API_PORT || 3001);

const routes = {
  'POST /api/speech/transcribe': transcribe,
  'POST /api/speech/speak': speak,
  'POST /api/llm/generate': generate,
  'POST /api/llm/written-turn': writtenTurn,
  'POST /api/llm/quiz-feedback': quizFeedback,
  'GET /api/ai/health': aiHealth
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function wrapRes(res) {
  const headers = {};
  return {
    setHeader(k, v) {
      headers[k] = v;
    },
    end(body) {
      const keys = Object.keys(headers);
      for (const k of keys) res.setHeader(k, headers[k]);
      res.statusCode = this.statusCode || 200;
      res.end(body);
    },
    statusCode: 200
  };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const key = `${req.method} ${url.pathname}`;
  const optionsKey = `OPTIONS ${url.pathname}`;

  // Map OPTIONS to same handler path for CORS preflight
  let handler = routes[key];
  if (!handler && req.method === 'OPTIONS') {
    const postPath = `POST ${url.pathname}`;
    handler = routes[postPath];
  }

  if (!handler) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, error: { code: 'NOT_FOUND', message: 'Not found' } }));
    return;
  }

  try {
    if (req.method === 'POST') {
      req.body = await readBody(req);
    } else {
      req.body = {};
    }
    await handler(req, wrapRes(res));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        ok: false,
        error: { code: 'INTERNAL', message: err.message || 'Server error' }
      })
    );
  }

  // silence unused
  void optionsKey;
});

server.listen(PORT, () => {
  const hasGroq = !!process.env.GROQ_API_KEY;
  const hasDg = !!process.env.DEEPGRAM_API_KEY;
  console.log(`[local-api] http://localhost:${PORT}`);
  console.log(`[local-api] GROQ_API_KEY: ${hasGroq ? 'ok' : 'MISSING'}`);
  console.log(`[local-api] DEEPGRAM_API_KEY: ${hasDg ? 'ok' : 'MISSING'}`);
});
