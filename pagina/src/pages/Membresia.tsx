import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { Crown, Brain, Star, ArrowRight, CheckCircle, Sparkles, Heart, Target, Zap } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import MercadoPagoCheckout from '../components/MercadoPagoCheckout'

type Plan = {
  id: number
  name: string
  slug: string
  description: string
  priceCOP: number
  priceUSD: number
  priceEUR: number
  annualPriceCOP: number
  annualPriceUSD: number
  annualPriceEUR: number
  monthlyDiscountPercent: number
  annualDiscountPercent: number
  sessionsPerMonth: number
  sessionsBreakdown: { name: string; count: number; description: string }[]
  benefits: string[]
  isActive: boolean
  isFeatured: boolean
}

const BENEFIT_ICONS: Record<string, typeof Crown> = {
  'Reducción del Estrés y la Ansiedad': Brain,
  'Transformación de Creencias': Sparkles,
  'Mejora tu Confianza y Autoestima': Star,
  'Claridad y Enfoque': Target,
  'Bienestar Físico y Emocional': Heart,
}

const SESSION_ICONS = [Brain, Sparkles, Zap]

export default function MembresiaPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [currency, setCurrency] = useState<'COP' | 'USD' | 'EUR'>('COP')
  const [isAnnual, setIsAnnual] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

  const navigate = useNavigate()

  const handleSelectPlan = (plan: Plan) => {
    const token = localStorage.getItem('conexionluz:token')
    if (!token) {
      // Redirect to login and come back after
      navigate('/login', { state: { from: '/membresia' } })
      return
    }
    setSelectedPlan(plan)
  }

  useEffect(() => {
    // Check if user is logged in and has active subscription to redirect
    const token = localStorage.getItem('conexionluz:token')
    if (token) {
      api.get<any>('/api/portal/me/').then(res => {
        if (res.ok && res.data.hasActiveSubscription) {
          navigate('/mi-perfil', { replace: true })
        }
      })
    }

    api.get<Plan[]>('/api/public/memberships/plans/').then(res => {
      if (res.ok) setPlans(res.data)
      setLoading(false)
    })
  }, [navigate])

  const getPriceData = (plan: Plan) => {
    let basePrice = 0
    let discount = 0

    if (isAnnual) {
      if (currency === 'USD') basePrice = plan.annualPriceUSD
      else if (currency === 'EUR') basePrice = plan.annualPriceEUR
      else basePrice = plan.annualPriceCOP
      discount = plan.annualDiscountPercent
    } else {
      if (currency === 'USD') basePrice = plan.priceUSD
      else if (currency === 'EUR') basePrice = plan.priceEUR
      else basePrice = plan.priceCOP
      discount = plan.monthlyDiscountPercent
    }

    const finalPrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice
    
    const format = (val: number) => {
      if (currency === 'USD') return `$${Math.round(val)} USD`
      if (currency === 'EUR') return `€${Math.round(val)} EUR`
      return `$${Math.round(val).toLocaleString('es-CO')} COP`
    }

    return {
      original: discount > 0 ? format(basePrice) : null,
      final: format(finalPrice),
      discount
    }
  }

  const featured = plans.find(p => p.isFeatured) || plans[0]

  // Show checkout when a plan is selected
  if (selectedPlan) {
    return (
      <MercadoPagoCheckout
        plan={selectedPlan}
        isAnnual={isAnnual}
        currency={currency}
        onBack={() => setSelectedPlan(null)}
      />
    )
  }

  return (
    <PublicLayout contentClassName="p-0">
      <div className="min-h-screen bg-transparent text-gray-800">
        {/* Pricing Section - TOP & MAIN */}
        <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/50 to-white pt-24 pb-20 px-6">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-amber-200/30 via-amber-100/10 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-200 rounded-full px-4 py-2 text-sm text-amber-700 font-bold mb-8 shadow-sm">
                <Crown className="h-4 w-4" />
                MEMBRESÍA PREMIUM
              </div>

              <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
                Tu Bienestar Mental, <span className="text-amber-600 font-bold text-2xl ml-2">Tu Mejor Inversión</span>
              </p>
            </div>

            {/* Billing Toggle & Currency Switcher */}
            <div className="flex flex-col items-center gap-8 mb-16">
              {/* Billing Toggle */}
              <div className="flex items-center gap-4 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                <button 
                  onClick={() => setIsAnnual(false)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${!isAnnual ? 'bg-amber-500 text-white shadow-md shadow-amber-200' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  MENSUAL
                </button>
                <button 
                  onClick={() => setIsAnnual(true)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${isAnnual ? 'bg-amber-500 text-white shadow-md shadow-amber-200' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  ANUAL
                  <span className="bg-emerald-100 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full font-bold">AHORRA</span>
                </button>
              </div>

              {/* Currency switcher */}
              <div className="flex justify-center gap-2">
                {(['COP', 'USD', 'EUR'] as const).map(c => (
                  <button key={c} onClick={() => setCurrency(c)}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${currency === c ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'}`}>
                    {c === 'COP' ? '🇨🇴 COP' : c === 'USD' ? '🇺🇸 USD' : '🇪🇺 EUR'}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="text-center text-gray-400 py-20">Cargando planes...</div>
            ) : plans.length === 0 ? (
              <div className="text-center text-gray-400 py-20">Próximamente</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                {plans.map(plan => {
                  const price = getPriceData(plan)
                  return (
                    <div key={plan.id} className={`relative group rounded-3xl overflow-hidden transition-all hover:shadow-2xl ${plan.isFeatured ? 'ring-2 ring-amber-500' : 'border border-gray-100 shadow-lg'}`}>
                      <div className={`relative bg-white rounded-3xl p-8 h-full flex flex-col`}>
                        {plan.isFeatured && (
                          <div className="flex items-center gap-1.5 text-xs font-black text-amber-600 mb-4 bg-amber-50 w-fit px-3 py-1 rounded-full">
                            <Crown className="h-3.5 w-3.5" /> PLAN DESTACADO
                          </div>
                        )}
                        <h3 className="text-xl font-black text-gray-900 mb-2">{plan.name}</h3>
                        {plan.description && <p className="text-gray-500 text-sm mb-6">{plan.description}</p>}

                        <div className="mb-6">
                          <div className="flex flex-col">
                            {price.original && (
                              <span className="text-sm text-gray-400 line-through font-medium mb-1">{price.original}</span>
                            )}
                            <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-black text-gray-900">{price.final}</span>
                              {price.discount > 0 && (
                                <span className="bg-emerald-100 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full font-bold ml-2">-{price.discount}%</span>
                              )}
                            </div>
                          </div>
                          <div className="text-gray-500 text-sm font-medium mt-1">
                            {isAnnual ? 'pago anual' : 'pago mensual'} · {plan.sessionsPerMonth} sesiones al mes
                          </div>
                        </div>

                        <div className="space-y-3 mb-8 flex-1">
                          {plan.benefits.slice(0, 5).map((b, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => handleSelectPlan(plan)}
                          className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-black text-sm transition-all shadow-md ${
                            plan.isFeatured
                              ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-200'
                              : 'bg-gray-900 text-white hover:bg-black'
                          }`}>
                          SUSCRIBIRME <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* Hero Section (Introduction) - MOVED DOWN */}
        <section className="py-20 px-6 bg-white border-t border-gray-100">
          <div className="relative max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-12 bg-gradient-to-br from-gray-900 via-primary to-accent bg-clip-text text-transparent leading-tight uppercase">
              TU CAMBIO EMPIEZA AQUÍ
            </h2>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
              <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-8 shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm">
                  <Brain className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900">La Salud Mental es Esencial</h3>
                <p className="text-gray-600 leading-relaxed">Cuidar tu mente es cuidar tu vida. Una mente en equilibrio te permite vivir con claridad, propósito y paz interior.</p>
              </div>
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900">Expansión de Conciencia</h3>
                <p className="text-gray-600 leading-relaxed">Al conectar con tu luz interior, expandes tu conciencia y te alineas con tu mejor versión. La transformación comienza desde adentro.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Extra Information Section - BOTTOM */}
        <section className="py-20 px-6 bg-gray-50/50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px flex-1 bg-gray-200" />
              <h2 className="text-sm font-bold tracking-[0.3em] text-gray-400 uppercase">Información Extra</h2>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* What's included */}
            {!loading && featured && (
              <div className="mb-20">
                <div className="text-center mb-10">
                  <h3 className="text-2xl font-black text-gray-900 mb-2">¿Qué incluye tu membresía?</h3>
                  <p className="text-gray-500">Detalles de las sesiones y beneficios incluidos en nuestros planes premium.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {featured.sessionsBreakdown.map((session, i) => {
                    const Icon = SESSION_ICONS[i] || Sparkles
                    return (
                      <div key={i} className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
                            <span className="text-lg font-black text-amber-600">{i + 1}</span>
                          </div>
                          <Icon className="h-5 w-5 text-amber-500" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">
                          {session.count > 0 ? `${session.count} ` : ''}{session.name}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{session.description}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Benefits */}
            {!loading && featured && featured.benefits.length > 0 && (
              <div>
                <div className="text-center mb-10">
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Beneficios del Proceso</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {featured.benefits.map((benefit, i) => {
                    const Icon = BENEFIT_ICONS[benefit] || CheckCircle
                    return (
                      <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 text-center">
                        <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
                          <Icon className="h-5 w-5 text-amber-600" />
                        </div>
                        <p className="text-xs font-bold text-gray-700 leading-tight">{benefit}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-12 shadow-2xl shadow-amber-200 text-white">
              <Crown className="h-12 w-12 text-white mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Invierte en Ti, <span className="text-amber-100">Transforma tu Vida</span>
              </h2>
              <p className="text-amber-50 mb-2 font-medium">Cada sesión es un paso hacia tu mejor versión.</p>
              <p className="text-white font-black text-xl mb-8 uppercase tracking-wider">Tu Cambio Comienza Hoy</p>
              <Link to="/agenda"
                className="inline-flex items-center gap-2 bg-white text-amber-600 font-black px-10 py-4 rounded-2xl hover:bg-gray-50 transition-all shadow-lg text-lg">
                AGENDAR SESIÓN <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
