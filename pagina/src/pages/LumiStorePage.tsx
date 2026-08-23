import React, { useEffect, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  Zap, 
  CheckCircle2, 
  Building2, 
  Lock, 
  Coins, 
  ChevronDown, 
  Wallet, 
  History,
  ArrowUpRight
} from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '@/components/ui/use-toast';

type LumiTx = {
  id: number;
  txType: string;
  txTypeLabel: string;
  amount: number;
  balanceAfter: number;
  description: string;
  referenceCode: string;
  createdAt: string;
};

type LumiWalletData = {
  balance: number;
  totalEarned: number;
  currencyName: string;
  currencySymbol: string;
  transactions: LumiTx[];
};

type LumiPackage = {
  id: string;
  name: string;
  tagline: string;
  baseLumis: number;
  bonusLumis: number;
  totalLumis: number;
  priceCOP: number;
  popular?: boolean;
  bestValue?: boolean;
  badge?: string;
  badgeBg: string;
  buttonGradient: string;
  borderAccent: string;
  features: string[];
};

const LUMI_PACKAGES: LumiPackage[] = [
  {
    id: 'pack-starter',
    name: 'Iniciación',
    tagline: 'Ideal para probar experiencias y terapias individuales',
    baseLumis: 200,
    bonusLumis: 0,
    totalLumis: 200,
    priceCOP: 10000,
    badge: '⚡ OFERTA POR TIEMPO LIMITADO',
    badgeBg: 'bg-slate-900 text-white font-black shadow-sm',
    buttonGradient: 'from-slate-800 to-slate-900 text-white hover:from-slate-900 hover:to-black',
    borderAccent: 'border-slate-200 hover:border-slate-300',
    features: [
      '200 Lumis acreditados al instante',
      'Sin vencimiento de saldo',
      'Acceso a ejercicios guiados',
      'Sin cobros ocultos'
    ]
  },
  {
    id: 'pack-popular',
    name: 'Foco & Bienestar',
    tagline: 'El preferido para meditación continua y talleres',
    baseLumis: 500,
    bonusLumis: 0,
    totalLumis: 500,
    priceCOP: 25000,
    popular: true,
    badge: '🔥 PRECIO ESPECIAL HOY · MÁS POPULAR',
    badgeBg: 'bg-teal-600 text-white font-black shadow-sm',
    buttonGradient: 'from-teal-600 via-emerald-600 to-teal-700 text-white shadow-teal-500/20 hover:shadow-teal-500/40',
    borderAccent: 'border-teal-300 ring-2 ring-teal-500/20',
    features: [
      '500 Lumis acreditados al instante',
      'Sin vencimiento de saldo',
      'Acceso a cursos y talleres en vivo',
      'Auditoría inmutable de saldo'
    ]
  },
  {
    id: 'pack-pro',
    name: 'Transformación Pro',
    tagline: 'Formación avanzada e hipnosis clínica profunda',
    baseLumis: 1000,
    bonusLumis: 0,
    totalLumis: 1000,
    priceCOP: 50000,
    bestValue: true,
    badge: '💎 TARIFA PREFERENCIAL DE RECARGA',
    badgeBg: 'bg-emerald-600 text-white font-black shadow-sm',
    buttonGradient: 'from-primary to-accent text-white shadow-lg hover:scale-[1.02]',
    borderAccent: 'border-emerald-400 ring-4 ring-emerald-400/20 shadow-xl',
    features: [
      '1.000 Lumis acreditados al instante',
      'Sin vencimiento de saldo',
      'Pase preferencial a Cursos Master',
      'Soporte prioritario 24/7'
    ]
  },
  {
    id: 'pack-master',
    name: 'Sanación Maestro',
    tagline: 'Recarga completa para programas de certificación integral',
    baseLumis: 2500,
    bonusLumis: 0,
    totalLumis: 2500,
    priceCOP: 120000,
    badge: '⏰ ÚLTIMOS CUPOS CON TASA ESPECIAL',
    badgeBg: 'bg-indigo-600 text-white font-black shadow-sm',
    buttonGradient: 'from-indigo-600 via-purple-600 to-indigo-800 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40',
    borderAccent: 'border-indigo-300 hover:border-indigo-400',
    features: [
      '2.500 Lumis acreditados al instante',
      'Sin vencimiento de saldo',
      'Acceso VIP a todos los módulos',
      'Atención personalizada con terapeutas'
    ]
  }
];

const FAQS = [
  {
    q: '¿Qué es la economía Lumi en ConexiónLuz?',
    a: 'Lumi (✨) es la moneda digital oficial de ConexiónLuz. Te permite recargar tu saldo con Pesos Colombianos (COP) para adquirir cursos, terapias guiadas, agendar citas con terapeutas certificados y desbloquear contenido exclusivo de salud mental.'
  },
  {
    q: '¿Los Lumis caducan o se vencen?',
    a: 'No. Todos los Lumis acreditados en tu billetera permanecen vigentes por tiempo indefinido para que los utilices a tu propio ritmo.'
  },
  {
    q: '¿Es seguro recargar Lumis en Pesos Colombianos?',
    a: 'Totalmente seguro. Utilizamos cifrado SSL de 256 bits y pasarelas oficiales habilitadas para Colombia (PSE, Nequi, Daviplata y Tarjetas de Crédito/Débito) con registros inmutables de auditoría contable en el backend.'
  }
];

export default function LumiStorePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = typeof window !== 'undefined' ? localStorage.getItem('conexionluz:token') : null;
  const isAuthed = Boolean(token);

  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<LumiWalletData | null>(null);
  const [selectedPack, setSelectedPack] = useState<LumiPackage | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pse' | 'nequi' | 'card'>('card');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Custom Mercado Pago Form fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [docType, setDocType] = useState('CC');
  const [docNumber, setDocNumber] = useState('');
  const [installments, setInstallments] = useState('1');
  const [selectedBank, setSelectedBank] = useState('bancolombia');
  const [nequiPhone, setNequiPhone] = useState('');

  const fetchWallet = async () => {
    if (!isAuthed) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const res = await api.get<LumiWalletData>('/api/portal/lumi/wallet/');
    if (res.ok && res.data) {
      setWallet(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    void fetchWallet();
  }, [isAuthed]);

  const handleExecutePurchase = async () => {
    if (!selectedPack) return;
    if (!isAuthed) {
      navigate('/login');
      return;
    }

    setPurchasing(true);

    const res = await api.post<any>('/api/payments/mercadopago/pay/', {
      itemType: 'lumi_package',
      packageId: selectedPack.id,
      totalLumis: selectedPack.totalLumis,
      priceCOP: selectedPack.priceCOP,
      paymentMethod: paymentMethod,
      cardData: {
        cardNumber: cardNumber,
        cardholderName: cardHolder,
        expiry: expiry,
        cvc: cvc,
        docType: docType,
        docNumber: docNumber,
        installments: installments,
        bank: selectedBank,
        phone: nequiPhone
      }
    });

    if (res.ok && res.data) {
      toast({
        title: "⚡ Recarga Exitosa por Mercado Pago",
        description: res.data.message || `Se han acreditado +${selectedPack.totalLumis.toLocaleString('es-CO')} Lumis a tu billetera. Saldo actual: ${res.data.balance.toLocaleString('es-CO')} Lumis.`,
      });
      window.dispatchEvent(new CustomEvent('lumi-balance-updated', { detail: res.data.balance }));
      setSelectedPack(null);
      void fetchWallet();
    } else {
      toast({
        title: "Error en Pago Mercado Pago",
        description: (res as any).error || "No se pudo completar el pago por Mercado Pago.",
        variant: "destructive"
      });
    }
    setPurchasing(false);
  };

  return (
    <PublicLayout contentClassName="p-0">
      {/* Main Content Area - Direct Packages & Prices View */}
      <section className="py-12 sm:py-16 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl space-y-12">

          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto pt-4">
            <span className="text-xs font-black uppercase tracking-widest text-primary">
              RECARGA DE LUMIS
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Planes de Lumis en Pesos Colombianos (COP)
            </h1>
            <p className="text-slate-600 text-sm font-medium">
              Selecciona tu paquete de recarga directa con bonificaciones exclusivas.
            </p>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {LUMI_PACKAGES.map((pack) => (
              <div
                key={pack.id}
                className={`relative bg-white rounded-3xl border ${pack.borderAccent} p-7 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5`}
              >
                {pack.badge && (
                  <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] tracking-wider uppercase shadow-sm shrink-0 whitespace-nowrap ${pack.badgeBg}`}>
                    {pack.badge}
                  </div>
                )}

                <div className="space-y-6 pt-2">
                  <div className="space-y-2 text-center border-b border-slate-100 pb-5">
                    <h3 className="text-lg font-black text-slate-900">{pack.name}</h3>
                    <p className="text-[11px] font-medium text-slate-500 leading-snug min-h-[32px]">
                      {pack.tagline}
                    </p>

                    <div className="pt-2 flex items-center justify-center gap-2">
                      <Sparkles className="h-6 w-6 text-emerald-600" />
                      <span className="text-4xl font-black text-slate-900 tracking-tight">
                        {pack.totalLumis.toLocaleString('es-CO')}
                      </span>
                      <span className="text-xs font-black text-emerald-700 uppercase">Lumis</span>
                    </div>

                    {pack.bonusLumis > 0 && (
                      <span className="inline-block text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mt-2">
                        🎉 Incluye +{pack.bonusLumis} Lumis Gratis
                      </span>
                    )}
                  </div>

                  {/* Feature checklist */}
                  <div className="space-y-3 text-xs font-medium text-slate-600">
                    {pack.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <div className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 space-y-4">
                  <div className="text-center">
                    <span className="text-3xl font-black text-slate-900">
                      ${pack.priceCOP.toLocaleString('es-CO')}
                    </span>
                    <span className="text-xs font-bold text-slate-400 block mt-0.5">COP (Pesos Colombianos)</span>
                  </div>

                  <button
                    onClick={() => navigate(`/comprar-lumis/checkout/${pack.id}`)}
                    className={`w-full font-black text-xs py-4 rounded-2xl transition-all duration-300 cursor-pointer bg-gradient-to-r ${pack.buttonGradient}`}
                  >
                    Recargar {pack.totalLumis} Lumis
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Method Badges Section */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900">Medios de Pago Soportados en Colombia</h3>
              <p className="text-xs text-slate-500 font-medium">Procesamiento inmediato con verificación directa.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col items-center gap-2">
                <Coins className="h-6 w-6 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">Nequi & Daviplata</span>
                <span className="text-[10px] text-slate-400">Transferencia instantánea</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col items-center gap-2">
                <Building2 className="h-6 w-6 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800">PSE Débito</span>
                <span className="text-[10px] text-slate-400">Todos los bancos colombianos</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col items-center gap-2">
                <CreditCard className="h-6 w-6 text-emerald-700" />
                <span className="text-xs font-bold text-slate-800">Tarjetas de Crédito</span>
                <span className="text-[10px] text-slate-400">Visa, Mastercard, AMEX</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-teal-600" />
                <span className="text-xs font-bold text-slate-800">Garantía SSL 256-bit</span>
                <span className="text-[10px] text-slate-400">Cifrado de grado bancario</span>
              </div>
            </div>
          </div>

          {/* Transaction Ledger Table if Authenticated */}
          {isAuthed && wallet?.transactions?.length ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <History className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Historial de Transacciones Auditado</h3>
                    <p className="text-xs text-slate-500">Registro inmutable contable de tu billetera Lumi.</p>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Ledger Inmutable</span>
                </span>
              </div>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Fecha</th>
                      <th className="py-3.5 px-4">Concepto</th>
                      <th className="py-3.5 px-4">Código Referencia</th>
                      <th className="py-3.5 px-4 text-right">Monto</th>
                      <th className="py-3.5 px-4 text-right">Saldo Final</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {wallet.transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 text-slate-400 font-mono">
                          {new Date(tx.createdAt).toLocaleDateString('es-CO')}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {tx.description}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400">
                          {tx.referenceCode}
                        </td>
                        <td className={`py-3.5 px-4 text-right font-black ${tx.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {tx.amount >= 0 ? `+${tx.amount}` : tx.amount} Lumis
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                          {tx.balanceAfter} Lumis
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {/* FAQs Accordion Section */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 space-y-6 shadow-sm">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">
                PREGUNTAS FRECUENTES
              </span>
              <h3 className="text-2xl font-black text-slate-900">Todo sobre la Economía Lumi</h3>
            </div>

            <div className="space-y-3 max-w-3xl mx-auto">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-slate-900 text-sm hover:bg-slate-50 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${openFaqIndex === idx ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-4 pb-4 text-xs font-medium text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Checkout Modal - MercadoPago Official Integration */}
      {selectedPack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200" onClick={() => setSelectedPack(null)} />
          
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden space-y-6 z-10 animate-in zoom-in-95 duration-200">
            
            {/* MercadoPago Branded Header */}
            <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-sky-600 p-6 text-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white border border-white/30 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> Mercado Pago Oficial Colombia
                </span>
                <button
                  onClick={() => setSelectedPack(null)}
                  className="text-white/80 hover:text-white text-base font-bold p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <h3 className="text-2xl font-black text-white">{selectedPack.name}</h3>
              <p className="text-xs text-sky-100 font-medium">
                Paga de forma 100% segura procesado por Mercado Pago (Conexión Luz)
              </p>
            </div>

            <div className="p-6 sm:p-8 pt-0 space-y-6">

              {/* Package & Price Breakdown */}
              <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-600">Acreditas en tu billetera:</span>
                  <div className="text-3xl font-black text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="h-6 w-6 text-sky-600" />
                    <span>{selectedPack.totalLumis.toLocaleString('es-CO')} Lumis</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block font-medium">Total en COP:</span>
                  <span className="text-2xl font-black text-sky-900">${selectedPack.priceCOP.toLocaleString('es-CO')} COP</span>
                </div>
              </div>

              {/* MercadoPago Payment Method Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Elige tu medio de pago Mercado Pago:
                </label>
                
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nequi')}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'nequi' 
                        ? 'border-sky-500 bg-sky-50/90 font-black text-sky-950 ring-2 ring-sky-500/20 shadow-xs' 
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Coins className="h-5 w-5 mx-auto mb-1.5 text-sky-600" />
                    <span className="text-xs font-bold block">Nequi / Daviplata</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pse')}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'pse' 
                        ? 'border-blue-600 bg-blue-50/90 font-black text-blue-950 ring-2 ring-blue-600/20 shadow-xs' 
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="h-5 w-5 mx-auto mb-1.5 text-blue-600" />
                    <span className="text-xs font-bold block">PSE Débito</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'card' 
                        ? 'border-slate-800 bg-slate-100 font-black text-slate-950 ring-2 ring-slate-400/20 shadow-xs' 
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="h-5 w-5 mx-auto mb-1.5 text-slate-700" />
                    <span className="text-xs font-bold block">Tarjetas de Crédito</span>
                  </button>
                </div>
              </div>

              {/* Custom Mercado Pago Embedded Form based on Payment Method */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 bg-slate-50/80 border border-slate-200/80 p-4.5 rounded-2xl animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4 text-sky-600" /> Tarjeta de Crédito / Débito
                    </span>
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                      Visa • Mastercard • Amex
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-600 block mb-1 uppercase">Número de Tarjeta</label>
                      <input
                        type="text"
                        placeholder="4500 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-extrabold text-slate-600 block mb-1 uppercase">Nombre del Titular</label>
                      <input
                        type="text"
                        placeholder="Como aparece en la tarjeta"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] font-extrabold text-slate-600 block mb-1 uppercase">Expiración (MM/AA)</label>
                        <input
                          type="text"
                          placeholder="12/28"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-extrabold text-slate-600 block mb-1 uppercase">Código CVC / CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="123"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="text-[11px] font-extrabold text-slate-600 block mb-1 uppercase">Tipo Doc.</label>
                        <select
                          value={docType}
                          onChange={(e) => setDocType(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-2 py-2.5 text-xs font-bold text-slate-900 outline-hidden focus:border-sky-500"
                        >
                          <option value="CC">CC</option>
                          <option value="NIT">NIT</option>
                          <option value="CE">CE</option>
                          <option value="PP">Pasaporte</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="text-[11px] font-extrabold text-slate-600 block mb-1 uppercase">Número de Documento</label>
                        <input
                          type="text"
                          placeholder="1018459201"
                          value={docNumber}
                          onChange={(e) => setDocNumber(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-extrabold text-slate-600 block mb-1 uppercase">Cuotas de Pago</label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-hidden focus:border-sky-500"
                      >
                        <option value="1">1 cuota (Sin intereses)</option>
                        <option value="3">3 cuotas</option>
                        <option value="6">6 cuotas</option>
                        <option value="12">12 cuotas</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'pse' && (
                <div className="space-y-3 bg-blue-50/70 border border-blue-200/80 p-4.5 rounded-2xl animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-blue-600" /> PSE – Débito Bancario Colombia
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      Acreditación Inmediata
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-600 block mb-1 uppercase">Selecciona tu Banco</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-hidden focus:border-blue-500"
                      >
                        <option value="bancolombia">Bancolombia</option>
                        <option value="banco_bogota">Banco de Bogotá</option>
                        <option value="nequi">Nequi</option>
                        <option value="daviplata">Daviplata / Davivienda</option>
                        <option value="bbva">BBVA Colombia</option>
                        <option value="scotiabank">Scotiabank Colpatria</option>
                        <option value="itau">Banco Itaú</option>
                        <option value="popular">Banco Popular</option>
                        <option value="occidente">Banco de Occidente</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="text-[11px] font-extrabold text-slate-600 block mb-1 uppercase">Tipo Doc.</label>
                        <select
                          value={docType}
                          onChange={(e) => setDocType(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-2 py-2.5 text-xs font-bold text-slate-900 outline-hidden"
                        >
                          <option value="CC">CC</option>
                          <option value="NIT">NIT</option>
                          <option value="CE">CE</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="text-[11px] font-extrabold text-slate-600 block mb-1 uppercase">Cédula / Documento</label>
                        <input
                          type="text"
                          placeholder="Número de cédula"
                          value={docNumber}
                          onChange={(e) => setDocNumber(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-hidden focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'nequi' && (
                <div className="space-y-3 bg-sky-50/70 border border-sky-200/80 p-4.5 rounded-2xl animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <Coins className="h-4 w-4 text-sky-600" /> Nequi / Daviplata Directo
                    </span>
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                      Notificación Móvil
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-600 block mb-1 uppercase">Número de Celular Nequi (Colombia)</label>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="300 000 0000"
                        value={nequiPhone}
                        onChange={(e) => setNequiPhone(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-extrabold text-slate-600 block mb-1 uppercase">Cédula del Titular</label>
                      <input
                        type="text"
                        placeholder="Número de documento registrado"
                        value={docNumber}
                        onChange={(e) => setDocNumber(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-hidden focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => void handleExecutePurchase()}
                disabled={purchasing}
                className="w-full bg-gradient-to-r from-sky-500 via-blue-600 to-sky-600 hover:opacity-95 text-white font-black text-sm py-4 rounded-2xl shadow-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Lock className="h-4 w-4 text-sky-100" />
                <span>{purchasing ? "Procesando pago en Mercado Pago..." : `Pagar con Mercado Pago ($${selectedPack.priceCOP.toLocaleString('es-CO')} COP)`}</span>
              </button>

              {/* Security Footer */}
              <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400 border-t border-slate-100 pt-3">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Transacción en página procesada de forma segura por Mercado Pago S.A.</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </PublicLayout>
  );
}
