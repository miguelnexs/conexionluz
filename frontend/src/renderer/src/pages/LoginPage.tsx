import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/api/client'
import { useTheme } from '@/components/ThemeProvider'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react'

interface LoginResponse {
  token: string
  username: string
}

const MOTIVATIONAL_QUOTES = [
  "La luz no se enciende para ocultarse, sino para iluminar el camino.",
  "El bienestar es la armonía entre el cuerpo, la mente y el alma.",
  "Un espacio para sanar, crecer y reconectar con nuestro ser.",
  "Conectando almas, compartiendo luz y transformando realidades.",
  "Cada día es una nueva oportunidad para inspirar y acompañar en el camino."
]

export function LoginPage(): JSX.Element {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { theme, setTheme } = useTheme()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shake, setShake] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const [googleClientId, setGoogleClientId] = useState<string | null>(null)
  const [googleEnabled, setGoogleEnabled] = useState(false)

  const [greeting, setGreeting] = useState('')
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const loadSettings = async () => {
      const res = await api.get<{ googleClientId?: string; googleEnabled?: boolean }>('/api/public/settings/')
      if (res.ok && res.data?.googleEnabled && res.data?.googleClientId) {
        setGoogleClientId(res.data.googleClientId)
        setGoogleEnabled(true)
      }
    }
    void loadSettings()

    // Pre-populate credentials if saved
    const savedUser = localStorage.getItem('remembered_username')
    const savedPass = localStorage.getItem('remembered_password')
    if (savedUser) {
      setUsername(savedUser)
      setRememberMe(true)
    }
    if (savedPass) {
      setPassword(savedPass)
    }

    // Determine greeting by hour
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting('¡Buenos días! ☀️ Que tengas un excelente día de trabajo.')
    } else if (hour < 19) {
      setGreeting('¡Buenas tardes! 🌤️ Listos para seguir adelante.')
    } else {
      setGreeting('¡Buenas noches! 🌙 Cerramos el día con dedicación.')
    }

    // Carousel interval for quotes
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!googleEnabled || !googleClientId) return
    const initializeGoogleSignIn = () => {
      const g = (window as any).google
      if (g) {
        g.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCallback,
        })
        const btnContainer = document.getElementById('google-btn-container')
        if (btnContainer) {
          btnContainer.innerHTML = ''
          g.accounts.id.renderButton(btnContainer, {
            theme: theme === 'dark' ? 'filled_black' : 'outline',
            size: 'large',
            width: btnContainer.clientWidth || 360,
            text: 'signin_with',
            shape: 'pill',
          })
        }
      }
    }
    const scriptId = 'google-jssdk'
    let script = document.getElementById(scriptId) as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => { setTimeout(initializeGoogleSignIn, 100) }
      document.body.appendChild(script)
    } else {
      if ((window as any).google) {
         setTimeout(initializeGoogleSignIn, 100)
      } else {
        const oldOnload = script.onload
        script.onload = (e) => {
          if (oldOnload) (oldOnload as any)(e)
          setTimeout(initializeGoogleSignIn, 100)
        }
      }
    }
  }, [googleEnabled, googleClientId, theme])

  const handleGoogleCallback = async (response: any) => {
    setError(null)
    setLoading(true)
    const res = await api.post<LoginResponse>('/api/auth/admin/google/', { credential: response.credential })
    setLoading(false)
    if (!res.ok) {
      setError(res.error || 'No se pudo iniciar sesión con Google')
      setShake(true)
      setTimeout(() => setShake(false), 600)
      return
    }
    login(res.data.token, res.data.username)
    navigate('/dashboard', { replace: true })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await api.post<LoginResponse>('/api/auth/admin/login/', { username, password })

    setLoading(false)

    if (!result.ok) {
      setError(result.error || 'Credenciales incorrectas')
      setShake(true)
      setTimeout(() => setShake(false), 600)
      return
    }

    // Save or clear credentials
    if (rememberMe) {
      localStorage.setItem('remembered_username', username)
      localStorage.setItem('remembered_password', password)
    } else {
      localStorage.removeItem('remembered_username')
      localStorage.removeItem('remembered_password')
    }

    login(result.data.token, result.data.username)
    navigate('/dashboard', { replace: true })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const x = (clientX - window.innerWidth / 2) / 30
    const y = (clientY - window.innerHeight / 2) / 30
    setMousePosition({ x, y })
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="h-full w-full flex relative overflow-hidden bg-background text-foreground transition-colors duration-500"
    >
      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-50">
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-border/60 bg-card/45 backdrop-blur-md text-foreground shadow-md transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95"
          aria-label="Toggle theme"
          title="Cambiar tema"
        >
          {theme === 'dark' ? (
            <Sun className="h-7 w-7 text-yellow-500 animate-[spin_20s_linear_infinite]" />
          ) : (
            <Moon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
          )}
        </button>
      </div>

      {/* Ambient blobs with Parallax */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: mousePosition.x * -1.5,
            y: mousePosition.y * -1.5,
          }}
          transition={{ type: "spring", stiffness: 45, damping: 25 }}
          className="absolute -top-48 -left-48 h-[600px] w-[600px] rounded-full bg-teal-500/10 dark:bg-teal-500/5 blur-[130px]"
        />
        <motion.div
          animate={{
            x: mousePosition.x * 1.8,
            y: mousePosition.y * 1.8,
          }}
          transition={{ type: "spring", stiffness: 35, damping: 20 }}
          className="absolute -bottom-48 -right-48 h-[600px] w-[600px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[130px]"
        />
        <motion.div
          animate={{
            x: mousePosition.x * 0.8,
            y: mousePosition.y * -0.8,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 28 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-accent/15 dark:bg-accent/5 blur-[110px]"
        />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.03] transition-opacity duration-300"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      {/* Main Split-Screen Container (Full Screen Edge-to-Edge) */}
      <div className="relative z-10 w-full h-full grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-transparent">
        
        {/* Left Side: Brand and Welcoming (Decoration) */}
        <div className="hidden md:flex md:col-span-5 relative p-16 bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950 text-white overflow-hidden border-r border-white/5 shadow-2xl">
          {/* Inner parallax blobs for the left panel */}
          <div className="absolute inset-0 pointer-events-none opacity-45">
            <motion.div
              animate={{
                x: mousePosition.x * -1.2,
                y: mousePosition.y * -1.2,
              }}
              transition={{ type: "spring", stiffness: 45, damping: 25 }}
              className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-teal-400/20 blur-[90px]"
            />
            <motion.div
              animate={{
                x: mousePosition.x * 1.5,
                y: mousePosition.y * 1.5,
              }}
              transition={{ type: "spring", stiffness: 35, damping: 20 }}
              className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-emerald-400/20 blur-[90px]"
            />
          </div>

          {/* Grid overlay for left panel */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Content Wrapper to Centralize horizontally within the Column */}
          <div className="relative z-10 flex flex-col justify-between h-full w-full max-w-sm lg:max-w-md mx-auto">
            {/* Top Brand */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 border border-white/20 shadow-md">
                <Sparkles className="h-7 w-7 text-teal-300 animate-pulse" />
              </div>
              <span className="font-extrabold tracking-wider uppercase text-sm text-teal-300">Conexión Luz</span>
            </div>

            {/* Middle Welcoming Content */}
            <div className="space-y-8 my-auto py-8">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                  Portal de Gestión <br />
                  <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                    Conciencia y Bienestar
                  </span>
                </h2>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 0.9, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-6 text-teal-100/90 text-lg lg:text-xl leading-relaxed font-semibold"
              >
                <p>
                  Conexión Luz es un ecosistema digital integral diseñado para unificar la administración de terapias alternativas, el seguimiento clínico de pacientes, la organización de conversatorios y la distribución de cursos educativos.
                </p>
                <p className="text-base lg:text-lg opacity-90 border-l-2 border-teal-300 pl-4 py-2 italic font-normal text-teal-200/90">
                  "Facilitamos el camino hacia la sanación y el crecimiento personal a través de herramientas eficientes para terapeutas y un portal transformador para pacientes."
                </p>
              </motion.div>

              {/* Core Features list */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-1 gap-5 pt-5 border-t border-white/10"
              >
                <div className="flex items-center gap-4 text-teal-200 hover:text-white transition-colors duration-300">
                  <div className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center text-teal-300">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-lg lg:text-xl font-bold">Citas & Calendario de Pacientes</div>
                </div>
                
                <div className="flex items-center gap-4 text-teal-200 hover:text-white transition-colors duration-300">
                  <div className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center text-teal-300">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="text-lg lg:text-xl font-bold">Cursos Online & Educación en Conciencia</div>
                </div>

                <div className="flex items-center gap-4 text-teal-200 hover:text-white transition-colors duration-300">
                  <div className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center text-teal-300">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="text-lg lg:text-xl font-bold">Gestión de Terapeutas & Conversatorios</div>
                </div>
              </motion.div>
            </div>

            {/* Bottom quotes carousel */}
            <div className="border-t border-white/15 pt-6">
              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIndex}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 0.8, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.4 }}
                  className="text-base lg:text-lg italic text-teal-200/80 leading-relaxed min-h-[50px] flex items-center"
                >
                  "{MOTIVATIONAL_QUOTES[quoteIndex]}"
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="col-span-12 md:col-span-7 flex flex-col justify-center items-center p-8 md:p-16 relative bg-transparent">
          {/* Shake wrapper around the form */}
          <motion.div
            animate={
              shake
                ? { x: [0, -8, 8, -8, 8, -4, 4, 0], transition: { duration: 0.4 } }
                : { x: 0 }
            }
            className="w-full max-w-sm lg:max-w-md mx-auto"
          >
            {/* Connection Status (Mobile display) */}
            <div className="md:hidden flex flex-col items-center mb-6 gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-md">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-teal-600 to-emerald-500 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Conexión Luz
              </h1>
            </div>

            {/* Status Badge */}
            <div className="mb-6 flex justify-start">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 dark:border-primary/10 px-5 py-2.5 text-base font-bold shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                <span>Servidor en línea</span>
              </span>
            </div>

            <div className="mb-8 flex flex-col gap-2.5">
              <h2 className="text-4xl lg:text-5xl font-black text-foreground flex items-center gap-2.5 tracking-tight">
                Iniciar sesión
                <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
              </h2>
              <p className="text-base lg:text-lg text-muted-foreground font-semibold">
                {greeting}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Username */}
              <div className="flex flex-col gap-2">
                <label htmlFor="login-username" className="text-lg font-bold text-foreground/90">
                  Usuario o Correo
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-muted-foreground/60">
                    <User className="h-6 w-6" />
                  </span>
                  <input
                    id="login-username"
                    type="text"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      setError(null)
                    }}
                    placeholder="conexionluz"
                    className="w-full rounded-2xl border border-input bg-background/50 dark:bg-background/25 pl-14 pr-4 py-3.5 text-lg text-foreground placeholder:text-muted-foreground/40 outline-none ring-primary/20 transition focus:border-primary focus:ring-2 disabled:opacity-50"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label htmlFor="login-password" className="text-lg font-bold text-foreground/90">
                  Contraseña
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-muted-foreground/60">
                    <Lock className="h-6 w-6" />
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError(null)
                    }}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-input bg-background/50 dark:bg-background/25 pl-14 pr-14 py-3.5 text-lg text-foreground placeholder:text-muted-foreground/40 outline-none ring-primary/20 transition focus:border-primary focus:ring-2 disabled:opacity-50"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-4 flex items-center text-muted-foreground/60 hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`h-6 w-6 rounded-md border flex items-center justify-center transition-all duration-300 ${
                    rememberMe 
                      ? 'bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/30 scale-105' 
                      : 'border-input bg-background/50 dark:bg-background/25 group-hover:border-primary/50'
                  }`}>
                    {rememberMe && (
                      <motion.svg
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="h-4.5 w-4.5 stroke-[3]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </div>
                  <span className="text-base font-bold text-foreground/80 group-hover:text-foreground transition-colors">
                    Recordar datos de acceso
                  </span>
                </label>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 dark:bg-destructive/5 px-4 py-2.5 text-sm text-destructive"
                >
                  <AlertCircle className="h-6 w-6 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={loading || !username || !password}
                className="relative mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-emerald-500 dark:to-emerald-600 px-6 py-4 text-lg font-black text-primary-foreground shadow-md shadow-primary/20 hover:shadow-primary/30 transition hover:brightness-105 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Ingresando…
                  </>
                ) : (
                  <>
                    Ingresar al panel
                    <ArrowRight className="h-6 w-6" />
                  </>
                )}
              </button>
            </form>

            {/* Google Divider */}
            {googleEnabled && googleClientId && (
              <div className="mt-8">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex-1 h-px bg-border/60" />
                  <span className="text-sm font-black text-muted-foreground/60 tracking-widest whitespace-nowrap uppercase">
                    O INICIAR CON GOOGLE
                  </span>
                  <div className="flex-1 h-px bg-border/60" />
                </div>
                <div className="flex justify-center min-h-[44px]">
                  <div id="google-btn-container" className="w-full flex justify-center" />
                </div>
              </div>
            )}
          </motion.div>
        </div>

      </div>

      {/* Floating Bottom Copyright */}
      <div className="absolute bottom-6 right-6 z-20 pointer-events-none">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="text-sm lg:text-base font-semibold text-muted-foreground/60"
        >
          © {new Date().getFullYear()} Conexión Luz · Panel interno
        </motion.p>
      </div>
    </div>
  )
}
