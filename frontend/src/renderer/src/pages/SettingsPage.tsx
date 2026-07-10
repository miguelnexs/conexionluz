import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  CreditCard,
  Globe,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Key,
  ToggleLeft,
  ToggleRight,
  Phone,
  Mail,
  Wifi,
  WifiOff,
  Loader2,
  User,
  BadgeCheck,
} from 'lucide-react'
import { api } from '@/api/client'

type SiteSettings = {
  mercadopagoPublicKey: string
  mercadopagoAccessToken: string
  mercadopagoEnabled: boolean
  siteName: string
  supportEmail: string
  supportWhatsapp: string
}

export function SettingsPage(): JSX.Element {
  const [settings, setSettings] = useState<SiteSettings>({
    mercadopagoPublicKey: '',
    mercadopagoAccessToken: '',
    mercadopagoEnabled: false,
    siteName: 'ConexiónLuz',
    supportEmail: '',
    supportWhatsapp: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAccessToken, setShowAccessToken] = useState(false)
  const [showPublicKey, setShowPublicKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'success' | 'error'
    message: string
    account?: { email: string; nickname: string; id: number; isSandbox: boolean }
  }>({ status: 'idle', message: '' })

  useEffect(() => {
    api.get<SiteSettings>('/api/settings/').then(res => {
      if (res.ok) setSettings(res.data)
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)
    const res = await api.patch<SiteSettings>('/api/settings/', settings)
    setSaving(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setSettings(res.data)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const toggle = (field: keyof SiteSettings) => {
    setSettings(s => ({ ...s, [field]: !s[field as keyof SiteSettings] }))
  }

  const testConnection = async () => {
    setTesting(true)
    setTestResult({ status: 'idle', message: '' })
    try {
      console.log('Testing MercadoPago connection...')
      const res = await api.get<any>('/api/settings/mercadopago/test/')
      console.log('MP Test Response:', res)
      
      setTesting(false)
      
      // The API client might return the data flattened if it contains "ok"
      const isOk = res && typeof res === 'object' && res.ok === true
      // Check both top-level and .data for the properties
      const connected = res?.connected || res?.data?.connected
      const account = res?.account || res?.data?.account
      const errorMsg = res?.error || res?.data?.error || 'Error al verificar las credenciales.'
      
      if (isOk && connected) {
        setTestResult({
          status: 'success',
          message: 'Conexión exitosa con MercadoPago.',
          account: account,
        })
      } else {
        setTestResult({
          status: 'error',
          message: errorMsg,
        })
      }
    } catch (e: any) {
      console.error('MP Test Error:', e)
      setTesting(false)
      setTestResult({ status: 'error', message: `Error inesperado: ${e?.message || 'Error desconocido'}` })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground animate-pulse">Cargando configuración...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-400/20 to-purple-500/10 flex items-center justify-center ring-1 ring-border">
            <Settings className="h-6 w-6 text-violet-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
            <p className="text-muted-foreground">Gestiona las integraciones y ajustes del sitio</p>
          </div>
        </div>

        <button
          onClick={() => void handleSave()}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
        >
          {saving ? (
            <><Save className="h-4 w-4 animate-pulse" /> Guardando...</>
          ) : saved ? (
            <><CheckCircle2 className="h-4 w-4" /> Guardado</>
          ) : (
            <><Save className="h-4 w-4" /> Guardar cambios</>
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">Configuración guardada correctamente.</p>
        </motion.div>
      )}

      {/* MercadoPago Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border bg-card shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b bg-gradient-to-r from-[#009EE3]/10 to-[#009EE3]/5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-[#009EE3] flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900">
                <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none">
                  <path d="M7 20.5c0-5.247 4.253-9.5 9.5-9.5h15.832C37.22 11 41 14.78 41 19.668c0 5.247-4.253 9.5-9.5 9.5H16.5" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M7 27.5h14.5C26.747 27.5 31 31.753 31 37H16.5C11.253 37 7 32.747 7 27.5z" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">MercadoPago</h3>
                <p className="text-sm text-muted-foreground">Pasarela de pagos para membresías</p>
              </div>
            </div>

            {/* Toggle */}
            <button
              onClick={() => toggle('mercadopagoEnabled')}
              className="flex items-center gap-3 px-5 py-2.5 rounded-xl border bg-background hover:bg-muted transition-colors"
            >
              {settings.mercadopagoEnabled ? (
                <>
                  <ToggleRight className="h-6 w-6 text-emerald-500" />
                  <span className="text-sm font-bold text-emerald-600">Activo</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm font-semibold text-muted-foreground">Inactivo</span>
                </>
              )}
            </button>
          </div>

          {settings.mercadopagoEnabled && (
            <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 w-fit">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-600">MercadoPago habilitado en el portal público</span>
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div className="rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              🔑 Obtén tus credenciales en{' '}
              <a href="https://www.mercadopago.com.co/developers/panel" target="_blank" rel="noopener noreferrer" className="underline font-bold inline-flex items-center gap-1">
                mercadopago.com.co/developers <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {/* Public Key */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Key className="h-4 w-4 text-muted-foreground" />
                Public Key
              </label>
              <div className="relative">
                <input
                  type={showPublicKey ? 'text' : 'password'}
                  value={settings.mercadopagoPublicKey}
                  onChange={e => setSettings(s => ({ ...s, mercadopagoPublicKey: e.target.value }))}
                  placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  className="w-full rounded-xl border bg-background px-4 py-3 pr-12 text-sm font-mono outline-none focus:ring-2 focus:ring-ring transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPublicKey(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPublicKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Usada en el frontend para inicializar el SDK. Empieza con <code className="bg-muted px-1 rounded">APP_USR-</code></p>
            </div>

            {/* Access Token */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                Access Token (secreto)
              </label>
              <div className="relative">
                <input
                  type={showAccessToken ? 'text' : 'password'}
                  value={settings.mercadopagoAccessToken}
                  onChange={e => setSettings(s => ({ ...s, mercadopagoAccessToken: e.target.value }))}
                  placeholder="APP_USR-xxxxxxxxxxxxxxxxxxxx"
                  className="w-full rounded-xl border bg-background px-4 py-3 pr-12 text-sm font-mono outline-none focus:ring-2 focus:ring-ring transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowAccessToken(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showAccessToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                Nunca compartas este token. Se usa solo en el servidor para crear preferencias de pago.
              </p>
            </div>
          </div>

          {/* ── Test Connection ── */}
          <div className="pt-4 border-t border-border space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm font-bold text-foreground">Probar conexión</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Verifica que tus credenciales son válidas llamando a la API de MercadoPago.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void testConnection()}
                disabled={testing || !settings.mercadopagoAccessToken}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#009EE3]/40 bg-[#009EE3]/5 hover:bg-[#009EE3]/10 text-[#009EE3] font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                {testing
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Probando...</>
                  : <><Wifi className="h-4 w-4" /> Probar conexión</>
                }
              </button>
            </div>

            {testResult.status !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border p-5 ${
                  testResult.status === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                    : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
                }`}
              >
                {testResult.status === 'success' ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-200 shrink-0">
                        <BadgeCheck className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-black text-emerald-700 dark:text-emerald-400">Conectado correctamente ✓</p>
                        <p className="text-xs text-emerald-600/70">Las credenciales son válidas y funcionales.</p>
                      </div>
                    </div>
                    {testResult.account && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-white dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-700 p-3">
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Usuario</p>
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            {testResult.account.nickname || 'Sin apodo'}
                          </p>
                        </div>
                        <div className="rounded-xl bg-white dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-700 p-3">
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Email</p>
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{testResult.account.email}</p>
                        </div>
                        <div className={`col-span-2 rounded-xl p-3 flex items-center gap-3 ${
                          testResult.account.isSandbox
                            ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200'
                            : 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200'
                        }`}>
                          <div className={`h-2.5 w-2.5 rounded-full animate-pulse ${
                            testResult.account.isSandbox ? 'bg-amber-400' : 'bg-emerald-500'
                          }`} />
                          <p className={`text-xs font-black ${
                            testResult.account.isSandbox ? 'text-amber-700' : 'text-emerald-700'
                          }`}>
                            {testResult.account.isSandbox
                              ? '⚠️ Modo Sandbox (pruebas) — Los pagos no son reales'
                              : '✅ Modo Producción — Los pagos son reales'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-red-500 flex items-center justify-center shadow-md shadow-red-200 shrink-0">
                      <WifiOff className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-black text-red-700 dark:text-red-400">Sin conexión con MercadoPago</p>
                      <p className="text-sm text-red-600/80 mt-1 leading-relaxed">{testResult.message}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Site Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border bg-card shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center ring-1 ring-border">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Información del Sitio</h3>
              <p className="text-sm text-muted-foreground">Datos generales de contacto y nombre del sitio</p>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Globe className="h-4 w-4 text-muted-foreground" />
              Nombre del Sitio
            </label>
            <input
              value={settings.siteName}
              onChange={e => setSettings(s => ({ ...s, siteName: e.target.value }))}
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
              placeholder="ConexiónLuz"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email de Soporte
            </label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={e => setSettings(s => ({ ...s, supportEmail: e.target.value }))}
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
              placeholder="hola@conexionluz.com"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Phone className="h-4 w-4 text-muted-foreground" />
              WhatsApp de Soporte
            </label>
            <input
              value={settings.supportWhatsapp}
              onChange={e => setSettings(s => ({ ...s, supportWhatsapp: e.target.value }))}
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
              placeholder="+57 300 000 0000"
            />
          </div>
        </div>
      </motion.div>

      {/* Save Button (bottom) */}
      <div className="flex justify-end">
        <button
          onClick={() => void handleSave()}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
        >
          {saving ? (
            <><Save className="h-4 w-4 animate-pulse" /> Guardando...</>
          ) : saved ? (
            <><CheckCircle2 className="h-4 w-4" /> Cambios guardados</>
          ) : (
            <><Save className="h-4 w-4" /> Guardar configuración</>
          )}
        </button>
      </div>
    </div>
  )
}
