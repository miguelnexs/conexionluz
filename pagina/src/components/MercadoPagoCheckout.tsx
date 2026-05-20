import { useEffect, useRef, useState } from 'react'
import { Crown, Shield, Lock, CreditCard, CheckCircle2, ArrowLeft, Loader2, AlertCircle, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react'
import { api } from '../api/client'
import PublicLayout from './PublicLayout'

type Plan = {
  id: number; name: string; slug: string; description: string
  priceCOP: number; priceUSD: number; priceEUR: number
  annualPriceCOP: number; annualPriceUSD: number; annualPriceEUR: number
  annualDiscountPercent: number; monthlyDiscountPercent: number
  sessionsPerMonth: number; benefits: string[]
}
type SiteConfig = { mercadopagoEnabled: boolean; mercadopagoPublicKey: string }
type Props = { plan: Plan; isAnnual: boolean; currency: 'COP' | 'USD' | 'EUR'; onBack: () => void }
type PayStatus = 'idle' | 'loading' | 'ready' | 'processing' | 'success' | 'pending' | 'error'

export default function MercadoPagoCheckout({ plan, isAnnual, currency, onBack }: Props) {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null)
  const [loadingConfig, setLoadingConfig] = useState(true)
  const [payStatus, setPayStatus] = useState<PayStatus>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [sdkReady, setSdkReady] = useState(false)
  const brickControllerRef = useRef<any>(null)

  const getPrice = () => {
    if (isAnnual) {
      if (currency === 'USD') return { value: plan.annualPriceUSD, label: `$${plan.annualPriceUSD} USD`, discount: plan.annualDiscountPercent }
      if (currency === 'EUR') return { value: plan.annualPriceEUR, label: `€${plan.annualPriceEUR} EUR`, discount: plan.annualDiscountPercent }
      return { value: plan.annualPriceCOP, label: `$${plan.annualPriceCOP.toLocaleString('es-CO')} COP`, discount: plan.annualDiscountPercent }
    }
    if (currency === 'USD') return { value: plan.priceUSD, label: `$${plan.priceUSD} USD`, discount: plan.monthlyDiscountPercent }
    if (currency === 'EUR') return { value: plan.priceEUR, label: `€${plan.priceEUR} EUR`, discount: plan.monthlyDiscountPercent }
    return { value: plan.priceCOP, label: `$${plan.priceCOP.toLocaleString('es-CO')} COP`, discount: plan.monthlyDiscountPercent }
  }
  const price = getPrice()

  // Load site config and user email
  useEffect(() => {
    const load = async () => {
      const [cfgRes, meRes] = await Promise.all([
        api.get<SiteConfig>('/api/public/settings/'),
        api.get<any>('/api/portal/me/')
      ])
      if (cfgRes.ok && cfgRes.data?.mercadopagoPublicKey) {
        setSiteConfig(cfgRes.data)
        // Initialize the MP SDK using the official npm package
        initMercadoPago(cfgRes.data.mercadopagoPublicKey, { locale: 'es-CO' })
        setSdkReady(true)
      } else {
        setErrorMsg('MercadoPago no está configurado. Contacta al administrador.')
        setPayStatus('error')
      }
      if (meRes.ok && meRes.data?.email) setEmail(meRes.data.email)
      setLoadingConfig(false)
    }
    void load()
  }, [])

  const handleSubmit = async (formData: any) => {
    if (!email) { setErrorMsg('Por favor ingresa tu correo electrónico.'); return }
    setPayStatus('processing')
    setErrorMsg(null)

    const res = await api.post<any>('/api/payments/mercadopago/pay/', {
      planId: plan.id,
      isAnnual,
      currency,
      formData,
      payerEmail: email,
    })

    if (res.ok) {
      const status = res.data?.status
      if (status === 'approved') {
        setPayStatus('success')
      } else if (status === 'in_process' || status === 'pending') {
        setPayStatus('pending')
      } else {
        setPayStatus('error')
        setErrorMsg(
          status === 'cc_rejected_bad_filled_card_number' ? 'Número de tarjeta incorrecto.' :
          status === 'cc_rejected_insufficient_amount' ? 'Fondos insuficientes.' :
          status === 'cc_rejected_bad_filled_date' ? 'Fecha de vencimiento incorrecta.' :
          status === 'cc_rejected_bad_filled_security_code' ? 'Código de seguridad incorrecto.' :
          res.data?.statusDetail || 'Pago rechazado. Verifica los datos de tu tarjeta e intenta nuevamente.'
        )
      }
    } else {
      setPayStatus('error')
      setErrorMsg(res.error || 'Error al procesar el pago. Intenta de nuevo.')
    }
  }

  const handleError = (error: any) => {
    console.error('MP CardPayment error:', error)
    setPayStatus('error')
    setErrorMsg('Ocurrió un error en el formulario de pago. Recarga la página.')
  }

  const handleReady = (controller: any) => {
    brickControllerRef.current = controller
    setPayStatus('ready')
  }

  const handlePayClick = async () => {
    if (!email) { setErrorMsg('Por favor ingresa tu correo electrónico.'); return }
    if (!brickControllerRef.current) { setErrorMsg('El formulario aún no está listo, espera un momento.'); return }
    setPayStatus('processing')
    setErrorMsg(null)
    try {
      const formData = await brickControllerRef.current.getFormData()
      if (formData) {
        await handleSubmit(formData)
      } else {
        setPayStatus('ready')
        setErrorMsg('Verifica los datos de tu tarjeta e intenta de nuevo.')
      }
    } catch (_) {
      // Brick shows inline validation errors — reset to ready so user can fix
      setPayStatus('ready')
    }
  }

  // ── SUCCESS ──
  if (payStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white">
        <div className="text-center max-w-md px-6">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-200">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">¡Pago exitoso!</h1>
          <p className="text-gray-500 text-lg mb-10">
            Tu membresía <strong>{plan.name}</strong> ha sido activada. Revisa tu correo para el recibo.
          </p>
          <Link to="/mi-perfil" className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-black shadow-xl hover:scale-105 transition-all">
            Ir a mi perfil <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    )
  }

  // ── PENDING ──
  if (payStatus === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-white">
        <div className="text-center max-w-md px-6">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-amber-200">
            <Loader2 className="h-12 w-12 text-white animate-spin" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Pago en proceso</h1>
          <p className="text-gray-500 text-lg mb-4">
            Tu pago está siendo verificado. Te notificaremos por correo cuando se confirme.
          </p>
          <Link to="/mi-perfil" className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-amber-500 text-white font-black shadow-lg hover:bg-amber-600 transition-all">
            Volver a mi perfil <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <PublicLayout contentClassName="p-0">
      <div className="min-h-screen bg-gradient-to-br from-violet-50/30 via-white to-amber-50/20">

        {/* Sticky top bar */}
        <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3 text-sm">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-primary font-semibold transition-colors">
              <ArrowLeft className="h-4 w-4" /> Planes
            </button>
            <ChevronRight className="h-4 w-4 text-gray-300" />
            <span className="font-bold text-gray-900">Pago seguro</span>
            <div className="ml-auto flex items-center gap-2 text-gray-400 text-xs font-semibold">
              <Lock className="h-3.5 w-3.5 text-primary" />
              <span>SSL 256-bit</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-[1fr,360px] gap-10 items-start">

            {/* ── LEFT: Payment form ── */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Completa tu pago</h1>
                <p className="text-gray-500 mt-1">Ingresa los datos de tu tarjeta de forma segura. Tu información está cifrada.</p>
              </div>

              {loadingConfig ? (
                <div className="rounded-3xl bg-white border border-gray-100 p-12 flex flex-col items-center gap-4 shadow-sm">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <p className="text-gray-500 font-semibold">Preparando pago seguro...</p>
                </div>
              ) : (
                <>
                  {/* Email */}
                  <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6 space-y-3">
                    <h2 className="font-black text-gray-900 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" /> Correo electrónico
                    </h2>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-5 py-3.5 text-sm font-medium outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all"
                    />
                    <p className="text-xs text-gray-400 ml-1">Tu recibo de pago se enviará aquí.</p>
                  </div>

                  {/* CardPayment Brick from npm package */}
                  {sdkReady && (
                    <div className="rounded-3xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                      <div className="px-6 pt-6 pb-3">
                        <h2 className="font-black text-gray-900 flex items-center gap-2">
                          <Lock className="h-4 w-4 text-primary" /> Datos de la tarjeta
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">Formulario cifrado · procesado por MercadoPago</p>
                      </div>

                      {payStatus === 'loading' || payStatus === 'idle' ? (
                        <div className="px-6 pb-6 space-y-4 animate-pulse">
                          <div className="h-14 bg-gray-100 rounded-2xl" />
                          <div className="h-14 bg-gray-100 rounded-2xl" />
                          <div className="grid grid-cols-2 gap-4">
                            <div className="h-14 bg-gray-100 rounded-2xl" />
                            <div className="h-14 bg-gray-100 rounded-2xl" />
                          </div>
                        </div>
                      ) : null}

                      <div className="px-3 pb-4">
                        <CardPayment
                          initialization={{ amount: price.value, payer: { email } }}
                          customization={{
                            visual: {
                              style: {
                                theme: 'default',
                                customVariables: {
                                  baseColor: '#7c3aed',
                                  baseColorFirstVariant: '#6d28d9',
                                  baseColorSecondVariant: '#5b21b6',
                                  borderRadiusMedium: '16px',
                                  borderRadiusLarge: '20px',
                                },
                              },
                              hideFormTitle: true,
                              hidePaymentButton: true,
                            },
                            paymentMethods: {
                              types: {
                                excluded: ['bank_transfer', 'ticket', 'atm', 'crypto'],
                              },
                              maxInstallments: 12,
                            },
                          }}
                          onError={handleError}
                          onReady={handleReady}
                        />
                      </div>
                    </div>
                  )}

                  {/* Error message */}
                  {errorMsg && payStatus === 'error' && (
                    <div className="rounded-2xl bg-red-50 border border-red-100 p-4 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600 font-medium">{errorMsg}</p>
                    </div>
                  )}

                  {/* Pay button — calls controller.submit() on the Brick */}
                  <div className="space-y-4">
                    <button
                      onClick={handlePayClick}
                      type="button"
                      disabled={payStatus === 'processing' || payStatus === 'idle' || payStatus === 'loading' || !sdkReady || payStatus !== 'ready'}
                      className="group w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-lg bg-gradient-to-r from-primary to-accent text-white shadow-2xl shadow-primary/25 hover:shadow-3xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                    >
                      {payStatus === 'processing' ? (
                        <><Loader2 className="h-5 w-5 animate-spin" /> Procesando pago...</>
                      ) : (
                        <><Lock className="h-5 w-5" /> Pagar {price.label}</>
                      )}
                    </button>

                    <p className="text-center text-[10px] text-gray-400 font-medium px-10">
                      Al completar la compra, aceptas nuestros{' '}
                      <Link to="/terminos" className="underline hover:text-primary transition-colors">términos y condiciones</Link>.
                    </p>
                  </div>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-6 text-xs text-gray-400 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Cifrado SSL 256-bit</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-black text-[#009EE3]">
                      <span>mercadopago</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-primary" />
                      <span>PCI DSS Compliant</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div className="sticky top-24 space-y-4">
              <div className="rounded-3xl bg-white border border-gray-100 shadow-xl overflow-hidden">
                <div className="p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#f6f1e9,#fef9ec)' }}>
                  <div className="absolute top-0 right-0 h-32 w-32 bg-amber-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative flex items-start gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400/30 to-amber-600/15 flex items-center justify-center border border-amber-200 shrink-0 shadow-sm">
                      <Crown className="h-7 w-7 text-amber-500" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Plan Premium</div>
                      <div className="font-black text-gray-900 text-lg leading-tight">{plan.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {isAnnual ? 'Suscripción Anual' : 'Suscripción Mensual'} · {plan.sessionsPerMonth} sesiones/mes
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-5 space-y-2.5 border-b border-gray-50">
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Incluye</div>
                  {plan.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      </div>
                      {b}
                    </div>
                  ))}
                </div>

                <div className="px-6 py-5 space-y-3">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Subtotal</span><span className="font-semibold text-gray-600">{price.label}</span>
                  </div>
                  {price.discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600">
                      <span>Descuento {price.discount}%</span><span className="font-bold">–{price.discount}%</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="font-black text-gray-900 text-lg">Total</span>
                    <span className="text-2xl font-black text-gray-900">{price.label}</span>
                  </div>
                  <p className="text-xs text-right text-gray-400">{isAnnual ? 'Pago único anual' : 'Renovación mensual'}</p>
                </div>

                <div className="px-6 pb-6">
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 p-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 mb-1">
                      <Shield className="h-4 w-4" /> Garantía de satisfacción
                    </div>
                    <p className="text-xs text-emerald-600 leading-relaxed">Si tu primera sesión no cumple tus expectativas, te devolvemos el dinero completo.</p>
                  </div>
                </div>
              </div>

              <p className="text-center text-xs text-gray-400">
                ¿Necesitas ayuda?{' '}
                <Link to="/contacto" className="text-primary font-bold hover:underline">Contáctanos</Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
