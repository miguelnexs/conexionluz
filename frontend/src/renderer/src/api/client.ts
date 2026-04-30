type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string }

function getBaseUrl(): string {
  const value = (import.meta as any).env?.VITE_API_URL as string | undefined
  return (value && value.trim()) || 'http://127.0.0.1:8000'
}

async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const isFormData = typeof FormData !== 'undefined' && init?.body instanceof FormData

    const res = await fetch(`${getBaseUrl()}${path}`, {
      ...init,
      headers: isFormData
        ? { ...(init?.headers || {}) }
        : {
            'Content-Type': 'application/json',
            ...(init?.headers || {})
          }
    })

    const text = await res.text()
    const json = text ? (JSON.parse(text) as any) : null

    if (!res.ok) {
      return { ok: false, error: json?.error || `HTTP ${res.status}` }
    }

    if (json && typeof json === 'object' && 'ok' in json) {
      return json as ApiResult<T>
    }

    return { ok: true, data: json as T }
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Network error' }
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  postForm: <T>(path: string, body: FormData) => request<T>(path, { method: 'POST', body }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  patchForm: <T>(path: string, body: FormData) => request<T>(path, { method: 'PATCH', body }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' })
}
