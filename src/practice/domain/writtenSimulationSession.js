const SESSION_KEY = 'practice.simulation.written.v1';

export function loadWrittenSimulationSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveWrittenSimulationSession(payload) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

export function clearWrittenSimulationSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}
