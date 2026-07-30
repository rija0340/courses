function apiError(code, message, status = 400, details = null) {
  return {
    ok: false,
    error: { code, message, details },
    status
  };
}

function mapUpstreamError(provider, status, bodyText) {
  if (status === 401 || status === 403) {
    return apiError('PROVIDER_AUTH', `${provider} auth failed`, 502);
  }
  if (status === 429) {
    return apiError('QUOTA', `${provider} rate limited`, 429);
  }
  return apiError(
    'PROVIDER_UNAVAILABLE',
    `${provider} request failed (${status})`,
    502,
    typeof bodyText === 'string' ? bodyText.slice(0, 300) : null
  );
}

module.exports = { apiError, mapUpstreamError };
