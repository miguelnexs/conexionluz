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
    const isFormData = typeof FormData !== 'undefined' && init?.body instanceof FormData
    const customHeaders = (init?.headers as Record<string, string>) || {}
    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(clientId ? { 'X-Client-Id': clientId } : {}),
      ...customHeaders
    }
    if (!isFormData && !headers['Content-Type'] && !headers['content-type']) {
      headers['Content-Type'] = 'application/json'
    }

    const res = await fetch(`${getBaseUrl()}${path}`, {
      ...init,
      headers
    })

    const text = await res.text()
    const json: unknown = text ? JSON.parse(text) : null

    if (!res.ok) {
      if (res.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('conexionluz:token')
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

function requestWithProgress<T>(
  path: string,
  formData: FormData,
  onProgress?: (percent: number) => void,
  signal?: AbortSignal
): Promise<ApiResult<T>> {
  return new Promise((resolve) => {
    try {
      const xhr = new XMLHttpRequest()
      const token = getToken()
      const clientId = getClientId()

      xhr.open('POST', `${getBaseUrl()}${path}`, true)

      // Set generous timeout for large video uploads (1 hour)
      xhr.timeout = 3600000

      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      if (clientId) xhr.setRequestHeader('X-Client-Id', clientId)

      let currentPercent = 0
      let processingTimer: ReturnType<typeof setInterval> | null = null
      // Max time to wait for server response after bytes are fully sent (5 min)
      let serverResponseTimer: ReturnType<typeof setTimeout> | null = null
      let settled = false

      const settle = (result: ApiResult<T>) => {
        if (settled) return
        settled = true
        stopProcessingTimer()
        stopServerResponseTimer()
        resolve(result)
      }

      const stopProcessingTimer = () => {
        if (processingTimer) {
          clearInterval(processingTimer)
          processingTimer = null
        }
      }

      const stopServerResponseTimer = () => {
        if (serverResponseTimer) {
          clearTimeout(serverResponseTimer)
          serverResponseTimer = null
        }
      }

      const updateProgress = (targetPercent: number) => {
        currentPercent = Math.max(currentPercent, targetPercent)
        if (onProgress) onProgress(currentPercent)
      }

      // Support AbortController to cancel the upload
      if (signal) {
        if (signal.aborted) {
          settle({ ok: false, error: 'Subida cancelada.' })
          return
        }
        signal.addEventListener('abort', () => {
          xhr.abort()
          settle({ ok: false, error: 'Subida cancelada.' })
        })
      }

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && e.total > 0) {
            if (e.loaded >= e.total) {
              // Bytes fully transferred to server: enter processing phase (96% -> 99%)
              updateProgress(96)
              if (!processingTimer) {
                processingTimer = setInterval(() => {
                  if (currentPercent < 99) {
                    currentPercent += 1
                    if (onProgress) onProgress(currentPercent)
                  }
                }, 2000)
              }
              // Safety net: if server doesn't respond in 5 minutes after upload completes, fail gracefully
              if (!serverResponseTimer) {
                serverResponseTimer = setTimeout(() => {
                  xhr.abort()
                  settle({ ok: false, error: 'El servidor tardó demasiado en responder. Por favor intenta de nuevo.' })
                }, 300000) // 5 minutes
              }
            } else {
              // Uploading payload: 0% to 95%
              const percent = Math.min(95, Math.floor((e.loaded / e.total) * 95))
              updateProgress(percent)
            }
          }
        }

        xhr.upload.onerror = () => {
          settle({ ok: false, error: 'Error de red durante la carga del archivo. Verifica tu conexión.' })
        }
      }

      xhr.onload = () => {
        try {
          const text = xhr.responseText
          const json: unknown = text ? JSON.parse(text) : null

          if (xhr.status >= 200 && xhr.status < 300) {
            updateProgress(100)
            if (json && typeof json === 'object' && 'ok' in json) {
              settle(json as ApiResult<T>)
            } else {
              settle({ ok: true, data: json as T })
            }
          } else {
            if (xhr.status === 401 && typeof window !== 'undefined') {
              localStorage.removeItem('conexionluz:token')
            }
            let error = `HTTP ${xhr.status}`
            if (xhr.status === 413) {
              error = 'El archivo es demasiado grande para el servidor (Límite excedido).'
            } else if (xhr.status === 504) {
              error = 'Tiempo de espera agotado en el servidor (Gateway Timeout).'
            } else if (xhr.status === 502 || xhr.status === 503) {
              error = 'El servidor no está disponible temporalmente. Intenta de nuevo en unos minutos.'
            } else if (isRecord(json) && typeof json.error === 'string') {
              error = json.error
            }
            settle({ ok: false, error })
          }
        } catch {
          settle({ ok: false, error: `Error del servidor (HTTP ${xhr.status})` })
        }
      }

      xhr.ontimeout = () => {
        settle({ ok: false, error: 'La carga del archivo superó el tiempo límite. Intenta con una conexión más estable.' })
      }

      xhr.onerror = () => {
        settle({ ok: false, error: 'Error de red durante la carga del archivo. Verifica tu conexión e intenta de nuevo.' })
      }

      xhr.onabort = () => {
        if (!settled) {
          settle({ ok: false, error: 'La subida fue interrumpida.' })
        }
      }

      xhr.send(formData)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error al enviar'
      resolve({ ok: false, error: message })
    }
  })
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  postForm: <T>(path: string, formData: FormData) => request<T>(path, { method: 'POST', body: formData }),
  postFormWithProgress: <T>(path: string, formData: FormData, onProgress?: (percent: number) => void, signal?: AbortSignal) =>
    requestWithProgress<T>(path, formData, onProgress, signal),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' })
}
