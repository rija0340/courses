#!/usr/bin/env bash
# Start LearnHub locally: CRA (3000) + local API gateway (3001)
# Default: Node local API (loads .env) — no Vercel login needed.
# Optional: USE_VERCEL_DEV=1 ./start.sh  → vercel dev (needs login)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

API_PORT="${API_PORT:-3001}"
APP_PORT="${PORT:-3000}"
API_PID=""
USE_VERCEL_DEV="${USE_VERCEL_DEV:-0}"

cleanup() {
  if [[ -n "${API_PID}" ]] && kill -0 "${API_PID}" 2>/dev/null; then
    echo ""
    echo "Stopping API (pid ${API_PID})…"
    kill "${API_PID}" 2>/dev/null || true
    wait "${API_PID}" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

echo "==> LearnHub local start"
echo "    app  → http://localhost:${APP_PORT}"
echo "    api  → http://localhost:${API_PORT}"
echo ""

if [[ ! -d node_modules ]] || [[ ! -f node_modules/.bin/react-scripts ]]; then
  echo "==> Installing npm dependencies…"
  npm install
fi

load_env_file() {
  local file="$1"
  [[ -f "$file" ]] || return 0
  echo "==> Loading ${file}"
  set -a
  # shellcheck disable=SC1090
  source "$file"
  set +a
}

if [[ ! -f .env && ! -f .env.local ]]; then
  echo "⚠️  No .env or .env.local found. Copy .env.example → .env"
  echo ""
else
  load_env_file ".env"
  load_env_file ".env.local"
fi

export REACT_APP_AI_GATEWAY_URL="${REACT_APP_AI_GATEWAY_URL:-http://localhost:${API_PORT}}"
export API_PORT

if [[ -z "${GROQ_API_KEY:-}" ]]; then
  echo "⚠️  GROQ_API_KEY missing in .env — simulation will fail until you add it."
fi
if [[ -z "${DEEPGRAM_API_KEY:-}" ]]; then
  echo "⚠️  DEEPGRAM_API_KEY missing in .env — speech STT/TTS will fall back when possible."
fi

start_local_api() {
  echo "==> Starting local API (scripts/local-api-server.js) on :${API_PORT}…"
  node scripts/local-api-server.js &
  API_PID=$!
}

start_vercel_api() {
  echo "==> Starting Vercel API on :${API_PORT} (USE_VERCEL_DEV=1)…"
  if [[ ! -x node_modules/.bin/vercel ]]; then
    npm install -D vercel@latest --no-fund --no-audit >/dev/null
  fi
  local VERCEL_BIN="npx --no-install vercel"
  if [[ -z "${VERCEL_TOKEN:-}" ]] && ! $VERCEL_BIN whoami >/dev/null 2>&1; then
    echo "    Not logged in — run: npm run vercel:login"
    $VERCEL_BIN login
  fi
  $VERCEL_BIN dev --listen "${API_PORT}" --yes &
  API_PID=$!
}

if [[ "${USE_VERCEL_DEV}" == "1" ]]; then
  start_vercel_api
else
  start_local_api
fi

sleep 1

if ! kill -0 "${API_PID}" 2>/dev/null; then
  echo "❌ API process exited early."
  exit 1
fi

echo "==> Starting React app on :${APP_PORT}…"
echo ""
PORT="${APP_PORT}" npm start
