type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function getBaseUrl(): string {
  // In development the Vite dev-server proxy forwards /api/* to Django,
  // so we use an empty base (same origin). In production the full URL
  // defaults to https://conexionluz.com or VITE_API_URL environment variable.
  const value = import.meta.env.VITE_API_URL
  if (value && value.trim()) return value.trim()
  if (import.meta.env.DEV) return ''
  return 'https://conexionluz.com'
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('conexionluz:token')
}

function getClientId(): string | null {
  if (typeof window === 'undefined') return null
  const existing = localStorage.getItem('conexionluz:clientId')
  if (existing && existing.trim()) return existing
  const cryptoObj = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined
  const id = cryptoObj && typeof cryptoObj.randomUUID === 'function'
    ? cryptoObj.randomUUID()
    : `cid_${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`
  localStorage.setItem('conexionluz:clientId', id)
  return id
}

async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const token = getToken()
    const clientId = getClientId()
    const res = await fetch(`${getBaseUrl()}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(clientId ? { 'X-Client-Id': clientId } : {}),
        ...(init?.headers || {})
      }
    })

    const text = await res.text()
    const json: unknown = text ? JSON.parse(text) : null

    if (!res.ok) {
      if (res.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('conexionluz:token')
          window.location.href = '/login'
        }
      }
      const error =
        isRecord(json) && typeof json.error === 'string' ? json.error : `HTTP ${res.status}`
      return { ok: false, error }
    }

    if (json && typeof json === 'object' && 'ok' in json) {
      return json as ApiResult<T>
    }

    return { ok: true, data: json as T }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Network error'
    return { ok: false, error: message }
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' })
}
