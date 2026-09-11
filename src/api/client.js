/**
 * Low-level HTTP client for the TreeHouse backend.
 *
 * Reads the base URL from VITE_TREEHOUSE_API_URL (set in .env).
 * Every request automatically attaches the bearer token from sessionStorage
 * so authenticated endpoints receive the correct Authorization header.
 */

const API_BASE = (import.meta.env.VITE_TREEHOUSE_API_URL || '').replace(/\/$/, '');

console.log(API_BASE);

export const hasApi = Boolean(API_BASE);

/** Retrieve the JWT access token stored after login. */
export function getStoredToken() {
  return sessionStorage.getItem('treehouse_access_token');
}

/** Retrieve the cached user object stored after login. */
export function getStoredUser() {
  try {
    return JSON.parse(sessionStorage.getItem('treehouse_user') || 'null');
  } catch {
    return null;
  }
}

/** Build headers for an outgoing request, adding JSON + auth headers as needed. */
function buildHeaders(hasBody) {
  const token = getStoredToken();
  return {
    ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Perform a fetch against the backend.
 * Throws on non-2xx responses so callers can handle errors uniformly.
 */
export async function apiRequest(path, options = {}) {
  if (!API_BASE) throw new Error('API base URL is not configured');
  console.log(path);
  console.log(options);
  const hasBody = Boolean(options.body);
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: { ...buildHeaders(hasBody), ...(options.headers || {}) },
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(`Request failed (${response.status}): ${message}`);
  }

  // 204 No Content — nothing to parse.
  if (response.status === 204) return null;
  return response.json();
}

/** GET a list resource, returning the `data` array or the raw array. */
export async function apiGetList(path) {
  const result = await apiRequest(path);
  const rows = result?.data || result;
  return Array.isArray(rows) ? rows : [];
}

/** POST a new resource and return the created object. */
export async function apiCreate(path, payload) {
  return apiRequest(path, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** PATCH (partial update) an existing resource. */
export async function apiUpdate(path, payload) {
  return apiRequest(path, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

/** DELETE a resource by its path. */
export async function apiDelete(path) {
  return apiRequest(path, { method: 'DELETE' });
}
