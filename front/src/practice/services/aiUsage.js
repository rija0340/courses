const STORAGE_KEY = 'practice.ai.usage.session.v1';

const EMPTY = () => ({
  stt: { ok: 0, fail: 0 },
  tts: { ok: 0, fail: 0 },
  llmGenerate: { ok: 0, fail: 0 },
  llmWritten: { ok: 0, fail: 0 },
  llmQuiz: { ok: 0, fail: 0 },
  tokens: { prompt: 0, completion: 0, total: 0 },
  errors: [],
  startedAt: new Date().toISOString()
});

function read() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY();
    return { ...EMPTY(), ...JSON.parse(raw) };
  } catch {
    return EMPTY();
  }
}

function write(data) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ai-usage-updated'));
  }
}

function pathToKind(path) {
  if (path.includes('/speech/transcribe')) return 'stt';
  if (path.includes('/speech/speak')) return 'tts';
  if (path.includes('/llm/generate')) return 'llmGenerate';
  if (path.includes('/llm/written-turn')) return 'llmWritten';
  if (path.includes('/llm/quiz-feedback')) return 'llmQuiz';
  return null;
}

export function getAiUsage() {
  return read();
}

export function resetAiUsage() {
  write(EMPTY());
}

export function recordAiSuccess(path, usage = null) {
  const kind = pathToKind(path);
  if (!kind) return;
  const data = read();
  if (!data[kind]) data[kind] = { ok: 0, fail: 0 };
  data[kind].ok += 1;
  if (usage && typeof usage === 'object') {
    data.tokens.prompt += Number(usage.prompt_tokens || usage.prompt || 0);
    data.tokens.completion += Number(usage.completion_tokens || usage.completion || 0);
    data.tokens.total += Number(usage.total_tokens || usage.total || 0);
  }
  write(data);
}

export function recordAiFailure(path, error) {
  const kind = pathToKind(path);
  const data = read();
  if (kind) {
    if (!data[kind]) data[kind] = { ok: 0, fail: 0 };
    data[kind].fail += 1;
  }
  const entry = {
    at: new Date().toISOString(),
    path,
    code: error?.code || 'ERROR',
    message: error?.message || String(error)
  };
  data.errors = [entry, ...(data.errors || [])].slice(0, 5);
  write(data);
}

export function totalCalls(usage = null) {
  const u = usage || read();
  const kinds = ['stt', 'tts', 'llmGenerate', 'llmWritten', 'llmQuiz'];
  return kinds.reduce((sum, k) => sum + (u[k]?.ok || 0) + (u[k]?.fail || 0), 0);
}
