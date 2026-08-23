import React, { useEffect, useRef, useState, useCallback } from 'react';
import PublicLayout from '../components/PublicLayout';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Award,
  Zap,
  Check,
  RefreshCw,
  Lock,
  CreditCard,
  X,
  Info
} from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '@/components/ui/use-toast';

declare global {
  interface Window {
    MercadoPago?: new (publicKey: string, options?: { locale: string }) => {
      bricks: () => {
        create: (
          brickType: string,
          containerId: string,
          config: Record<string, unknown>
        ) => Promise<{ unmount: () => void }>;
      };
    };
  }
}

type LumiPackage = {
  id: string;
  name: string;
  tagline: string;
  totalLumis: number;
  priceCOP: number;
  bonusLumis: number;
  features: string[];
};

const PACKAGES_MAP: Record<string, LumiPackage> = {
  'pack-starter': {
    id: 'pack-starter',
    name: 'Paquete Iniciación',
    tagline: 'Ideal para probar experiencias y terapias individuales',
    totalLumis: 200,
    priceCOP: 10000,
    bonusLumis: 0,
    features: ['200 Lumis acreditados al instante', 'Sin fecha de expiración', 'Acceso a ejercicios guiados']
  },
  'pack-popular': {
    id: 'pack-popular',
    name: 'Paquete Foco & Bienestar',
    tagline: 'El preferido para meditación continua y talleres',
    totalLumis: 500,
    priceCOP: 25000,
    bonusLumis: 0,
    features: ['500 Lumis acreditados al instante', 'Sin fecha de expiración', 'Acceso a cursos y talleres']
  },
  'pack-pro': {
    id: 'pack-pro',
    name: 'Paquete Transformación Pro',
    tagline: 'Formación avanzada e hipnosis clínica profunda',
    totalLumis: 1000,
    priceCOP: 50000,
    bonusLumis: 0,
    features: ['1.000 Lumis acreditados al instante', 'Pase preferencial a Cursos Master', 'Soporte prioritario']
  },
  'pack-master': {
    id: 'pack-master',
    name: 'Paquete Sanación Maestro',
    tagline: 'Recarga completa para programas de certificación integral',
    totalLumis: 2500,
    priceCOP: 120000,
    bonusLumis: 0,
    features: ['2.500 Lumis acreditados al instante', 'Acceso VIP a todos los módulos', 'Atención personalizada de terapeutas']
  }
};

const MP_PUBLIC_KEY = 'APP_USR-fc563bea-a424-40a0-825f-88d858950f7b';

export default function LumiCheckoutPage() {
  const { packageId } = useParams<{ packageId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const token = typeof window !== 'undefined' ? localStorage.getItem('conexionluz:token') : null;
  const isAuthed = Boolean(token);
  const userEmail = typeof window !== 'undefined'
    ? (localStorage.getItem('conexionluz:email') || 'cliente@conexionluz.com')
    : 'cliente@conexionluz.com';

  const targetPack = (packageId && PACKAGES_MAP[packageId]) ? PACKAGES_MAP[packageId] : PACKAGES_MAP['pack-popular'];

  // ─── State ────────────────────────────────────────────────────────────────
  const [brickReady, setBrickReady] = useState(false);
  const [brickLoading, setBrickLoading] = useState(true);
  const [brickError, setBrickError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null);
  const [verifyMessage, setVerifyMessage] = useState<string>('');
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [brickInteracted, setBrickInteracted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const brickInstanceRef = useRef<{ unmount: () => void } | null>(null);
  const brickMounted = useRef(false);
  const brickContainerRef = useRef<HTMLDivElement>(null);

  const mpPaymentId = searchParams.get('payment_id') || searchParams.get('collection_id');
  const mpStatus = searchParams.get('status');

  // ─── Block browser back button when brick is interacted ───────────────────
  useEffect(() => {
    if (!brickInteracted || paymentSuccess !== null) return;
    // Push a dummy history entry so the back button triggers popstate
    window.history.pushState({ guardedCheckout: true }, '');
    const handlePopState = () => {
      // Re-push state to keep blocking
      window.history.pushState({ guardedCheckout: true }, '');
      setShowExitWarning(true);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [brickInteracted, paymentSuccess]);

  // ─── Warn on browser tab close / refresh ──────────────────────────────────
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (brickInteracted && paymentSuccess === null && !processing) {
        e.preventDefault();
        e.returnValue = '¿Seguro que quieres salir? Perderás los datos ingresados en el formulario de pago.';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [brickInteracted, paymentSuccess, processing]);

  // ─── Main effect ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthed) {
      navigate('/login');
      return;
    }

    if (mpPaymentId && mpStatus === 'approved') {
      void (async () => {
        setVerifying(true);
        const res = await api.post<any>('/api/payments/mercadopago/verify/', {
          paymentId: mpPaymentId,
          packageId: targetPack.id,
          totalLumis: targetPack.totalLumis,
          priceCOP: targetPack.priceCOP
        });
        if (res.ok && res.data) {
          setPaymentSuccess(true);
          setVerifyMessage(res.data.message || `¡Pago aprobado! +${targetPack.totalLumis.toLocaleString('es-CO')} Lumis acreditados.`);
          window.dispatchEvent(new CustomEvent('lumi-balance-updated', { detail: res.data.balance }));
        } else {
          setPaymentSuccess(false);
          setVerifyMessage((res as any).error || 'El pago no pudo ser verificado.');
        }
        setVerifying(false);
      })();
      return;
    }

    if (mpStatus && mpStatus !== 'approved') {
      setPaymentSuccess(false);
      setVerifyMessage('El pago fue cancelado en Mercado Pago. No se realizó ningún cobro.');
      return;
    }

    mountBrick();

    return () => {
      if (brickInstanceRef.current) {
        try { brickInstanceRef.current.unmount(); } catch (_) { /* ignore */ }
        brickInstanceRef.current = null;
        brickMounted.current = false;
      }
    };
  }, [isAuthed, mpPaymentId, retryCount]);

  // ─── Mount Brick ──────────────────────────────────────────────────────────
  const mountBrick = useCallback(() => {
    const tryMount = async () => {
      if (brickMounted.current) return;
      setBrickLoading(true);
      setBrickError(null);

      let retries = 0;
      while (typeof window.MercadoPago === 'undefined' && retries < 25) {
        await new Promise(r => setTimeout(r, 300));
        retries++;
      }

      if (typeof window.MercadoPago === 'undefined') {
        setBrickError('No se pudo cargar el SDK de Mercado Pago. Verifica tu conexión a internet y recarga la página.');
        setBrickLoading(false);
        return;
      }

      // Ensure container exists
      const container = document.getElementById('mp-payment-brick');
      if (!container) {
        setBrickError('El formulario no pudo inicializarse. Recarga la página.');
        setBrickLoading(false);
        return;
      }

      try {
        const mp = new window.MercadoPago!(MP_PUBLIC_KEY, { locale: 'es-CO' });
        const bricks = mp.bricks();
        brickMounted.current = true;

        const brick = await bricks.create('payment', 'mp-payment-brick', {
          initialization: {
            amount: targetPack.priceCOP,
            payer: { email: userEmail },
          },
          customization: {
            paymentMethods: {
              debitCard: 'all',
              creditCard: 'all',
              bankTransfer: 'all',
              ticket: 'all',
            },
            visual: {
              style: { theme: 'default' },
              hideFormTitle: true,
            },
          },
          callbacks: {
            onReady: () => {
              setBrickReady(true);
              setBrickLoading(false);
              // Auto-scroll to brick after a short delay
              setTimeout(() => {
                brickContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 400);
            },
            onSubmit: async ({ selectedPaymentMethod, formData }: any) => {
              setProcessing(true);
              setBrickInteracted(true);
              try {
                const res = await api.post<any>('/api/payments/mercadopago/pay/', {
                  itemType: 'lumi_package',
                  packageId: targetPack.id,
                  totalLumis: targetPack.totalLumis,
                  priceCOP: targetPack.priceCOP,
                  payerEmail: formData.payer?.email || userEmail,
                  paymentMethod: selectedPaymentMethod,
                  formData: formData,
                  cardData: {
                    token: formData.token,
                    payment_method_id: formData.payment_method_id,
                    issuer_id: formData.issuer_id,
                    installments: formData.installments || 1,
                    docType: formData.payer?.identification?.type || 'CC',
                    docNumber: formData.payer?.identification?.number || '',
                    cardholderName: formData.payer?.email || userEmail,
                  },
                });

                if (res.ok && res.data) {
                  setPaymentSuccess(true);
                  setBrickInteracted(false);
                  setVerifyMessage(res.data.message || `¡Pago Aprobado! +${targetPack.totalLumis.toLocaleString('es-CO')} Lumis acreditados.`);
                  window.dispatchEvent(new CustomEvent('lumi-balance-updated', { detail: res.data.balance }));
                  toast({
                    title: '⚡ Recarga Aprobada',
                    description: `+${targetPack.totalLumis.toLocaleString('es-CO')} Lumis acreditados a tu billetera.`,
                  });
                  if (brickInstanceRef.current) {
                    try { brickInstanceRef.current.unmount(); } catch (_) { /* ignore */ }
                  }
                } else {
                  setPaymentSuccess(false);
                  setVerifyMessage((res as any).error || 'El pago fue rechazado. No se realizó ningún cobro.');
                  toast({
                    title: 'Pago Rechazado',
                    description: (res as any).error || 'Verifica los datos e intenta nuevamente.',
                    variant: 'destructive',
                  });
                }
              } catch (err) {
                setPaymentSuccess(false);
                setVerifyMessage('Error de conexión. No se realizó ningún cobro.');
                toast({
                  title: 'Error de Conexión',
                  description: 'No se pudo procesar el pago. Intenta nuevamente.',
                  variant: 'destructive',
                });
              }
              setProcessing(false);
            },
            onError: (error: any) => {
              console.error('MP Brick error:', error);
              if (error?.message?.includes('already mounted')) return;
              setBrickError(`Error al cargar el formulario: ${error?.message || 'Intenta recargando la página.'}`);
              setBrickLoading(false);
            },
            onClickEditShippingData: () => { setBrickInteracted(true); },
          },
        });

        brickInstanceRef.current = brick;
      } catch (err: any) {
        if (!err?.message?.includes('already mounted')) {
          setBrickError(`Error al inicializar: ${err?.message || 'Recarga la página e intenta nuevamente.'}`);
        }
        brickMounted.current = false;
        setBrickLoading(false);
      }
    };

    void tryMount();
  }, [targetPack, userEmail]);

  // ─── Retry handler ────────────────────────────────────────────────────────
  const handleRetry = () => {
    if (brickInstanceRef.current) {
      try { brickInstanceRef.current.unmount(); } catch (_) { /* ignore */ }
      brickInstanceRef.current = null;
    }
    brickMounted.current = false;
    setPaymentSuccess(null);
    setBrickError(null);
    setBrickReady(false);
    setBrickLoading(true);
    setBrickInteracted(false);
    setRetryCount(c => c + 1);
  };

  // ─── Exit warning modal (browser back / manual) ──────────────────────────
  const ExitWarningModal = ({ onStay, onLeave }: { onStay: () => void; onLeave: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full space-y-5 border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
            <AlertCircle className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">¿Salir del pago?</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Perderás los datos ingresados en el formulario</p>
          </div>
        </div>
        <p className="text-sm font-medium text-slate-700">
          Tienes información en el formulario de pago. Si sales ahora, deberás volver a ingresarla. <strong className="text-slate-900">No se realizará ningún cobro.</strong>
        </p>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onStay}
            className="flex-1 bg-slate-900 text-white font-black text-xs py-3 rounded-2xl hover:bg-slate-800 transition-all"
          >
            Continuar con el pago
          </button>
          <button
            onClick={onLeave}
            className="flex-1 bg-slate-100 text-slate-700 font-bold text-xs py-3 rounded-2xl hover:bg-slate-200 transition-all border border-slate-200"
          >
            Sí, salir
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <PublicLayout contentClassName="p-0">
      {/* Exit warning modal (back button / manual) */}
      {showExitWarning && (
        <ExitWarningModal
          onStay={() => setShowExitWarning(false)}
          onLeave={() => { setShowExitWarning(false); setBrickInteracted(false); navigate('/comprar-lumis'); }}
        />
      )}

      <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4">
        <div className="container mx-auto max-w-5xl space-y-6">

          {/* ── Top nav ── */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={() => {
                if (brickInteracted && paymentSuccess === null) {
                  setShowExitWarning(true);
                } else {
                  navigate('/comprar-lumis');
                }
              }}
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors bg-white border border-slate-200 shadow-sm px-4 py-2.5 rounded-2xl"
            >
              <ArrowLeft className="h-4 w-4" /> Volver a Paquetes
            </button>

            {/* Step indicator */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className="bg-emerald-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">1</span>
              <span className="text-slate-400">Paquete</span>
              <span className="text-slate-300">›</span>
              <span className="bg-slate-900 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">2</span>
              <span className="text-slate-700 font-extrabold">Pago</span>
              <span className="text-slate-300">›</span>
              <span className="bg-slate-100 text-slate-400 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">3</span>
              <span className="text-slate-400">Confirmación</span>
            </div>
          </div>

          {/* ── Manual exit warning (for non-React-Router navigation) ── */}
          {showExitWarning && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
              <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full space-y-5 border border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                      <AlertCircle className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">¿Salir del pago?</h3>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">Perderás los datos del formulario</p>
                    </div>
                  </div>
                  <button onClick={() => setShowExitWarning(false)} className="text-slate-400 hover:text-slate-700 p-1">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm font-medium text-slate-700">
                  Si sales ahora deberás volver a ingresar tus datos de pago. <strong className="text-slate-900">No se realizará ningún cobro.</strong>
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowExitWarning(false)}
                    className="flex-1 bg-slate-900 text-white font-black text-xs py-3 rounded-2xl hover:bg-slate-800 transition-all"
                  >
                    Continuar con el pago
                  </button>
                  <button
                    onClick={() => { setShowExitWarning(false); setBrickInteracted(false); navigate('/comprar-lumis'); }}
                    className="flex-1 bg-slate-100 text-slate-700 font-bold text-xs py-3 rounded-2xl hover:bg-slate-200 transition-all border border-slate-200"
                  >
                    Sí, salir
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Verifying overlay ── */}
          {verifying && (
            <div className="bg-white border border-emerald-200 rounded-3xl p-10 text-center shadow-xl space-y-4">
              <div className="relative mx-auto w-16 h-16">
                <Loader2 className="h-16 w-16 text-emerald-500 animate-spin absolute inset-0" />
                <Lock className="h-6 w-6 text-emerald-700 absolute inset-0 m-auto" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Verificando Pago…</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">No cierres esta ventana. Consultando el estado oficial de la transacción con Mercado Pago.</p>
            </div>
          )}

          {/* ── Success / Error ── */}
          {paymentSuccess !== null && !verifying && (
            <div className={`rounded-3xl border p-10 text-center shadow-xl space-y-6 ${paymentSuccess ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
              {paymentSuccess ? (
                <>
                  <div className="relative mx-auto w-24 h-24">
                    <div className="h-24 w-24 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-slate-900">¡Recarga Aprobada! ⚡</h3>
                    <p className="text-sm font-medium text-slate-700 max-w-lg mx-auto">{verifyMessage}</p>
                  </div>
                  <div className="bg-emerald-100/80 border border-emerald-200 rounded-2xl p-4 max-w-xs mx-auto">
                    <div className="flex items-center justify-center gap-2 text-emerald-800 font-black text-lg">
                      <Sparkles className="h-5 w-5" />
                      <span>+{targetPack.totalLumis.toLocaleString('es-CO')} Lumis</span>
                    </div>
                    <p className="text-xs text-emerald-700 font-semibold mt-1">Acreditados inmediatamente a tu billetera</p>
                  </div>
                  <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
                    <Link to="/actividades/tests-bienestar" className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-7 py-3.5 rounded-2xl shadow-xl transition-all">
                      Explorar Tests & Cursos
                    </Link>
                    <Link to="/comprar-lumis" className="bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs px-6 py-3.5 rounded-2xl border border-slate-200 transition-all shadow-sm">
                      Ver mi Billetera
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-24 w-24 rounded-full bg-rose-100 border-2 border-rose-300 flex items-center justify-center mx-auto">
                    <AlertCircle className="h-12 w-12 text-rose-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-slate-900">Pago No Completado</h3>
                    <p className="text-sm font-medium text-slate-700 max-w-lg mx-auto">{verifyMessage}</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 max-w-sm mx-auto text-left">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                      <div className="text-xs font-semibold text-amber-800 space-y-1">
                        <p className="font-black">Posibles causas:</p>
                        <ul className="list-disc list-inside space-y-0.5 font-medium text-amber-700">
                          <li>Fondos insuficientes en tu cuenta</li>
                          <li>Datos de tarjeta incorrectos</li>
                          <li>Pago bloqueado por el banco</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <button
                      onClick={handleRetry}
                      className="inline-flex items-center gap-2 bg-slate-900 text-white font-black text-xs px-7 py-3.5 rounded-2xl shadow-xl hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4" /> Intentar nuevamente
                    </button>
                    <Link to="/comprar-lumis" className="bg-white text-slate-700 font-bold text-xs px-6 py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
                      Elegir otro paquete
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Main layout ── */}
          {!verifying && paymentSuccess === null && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

              {/* Summary card */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-5">
                  <div className="border-b border-slate-100 pb-4 space-y-1">
                    <span className="text-[10px] font-black tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase">Resumen de Compra</span>
                    <h3 className="text-xl font-black text-slate-900 mt-2">{targetPack.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{targetPack.tagline}</p>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Lumis:</span>
                      <div className="flex items-center gap-1.5 font-black text-slate-900 text-xl">
                        <Sparkles className="h-5 w-5 text-emerald-600" />
                        {targetPack.totalLumis.toLocaleString('es-CO')}
                      </div>
                    </div>
                    {targetPack.bonusLumis > 0 && (
                      <div className="flex items-center justify-between text-xs font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 p-2 rounded-xl">
                        <span>🎁 Bonus gratis:</span>
                        <span>+{targetPack.bonusLumis.toLocaleString('es-CO')} Lumis</span>
                      </div>
                    )}
                    <div className="border-t border-emerald-200 pt-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Total:</span>
                      <span className="text-2xl font-black text-slate-900">${targetPack.priceCOP.toLocaleString('es-CO')} <span className="text-sm font-bold text-slate-500">COP</span></span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {targetPack.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                        <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200">
                          <Check className="h-3 w-3 text-emerald-700" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center gap-3 text-xs font-bold text-slate-600">
                    <Award className="h-5 w-5 text-amber-500 shrink-0" />
                    <span>Lumis sin fecha de expiración. Cobro protegido.</span>
                  </div>
                </div>

                {/* Security badges */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Seguridad de pago</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { icon: <Lock className="h-3.5 w-3.5" />, label: 'SSL 256-bit' },
                      { icon: <ShieldCheck className="h-3.5 w-3.5" />, label: 'PCI-DSS' },
                      { icon: <CreditCard className="h-3.5 w-3.5" />, label: 'Mercado Pago' },
                      { icon: <Zap className="h-3.5 w-3.5" />, label: 'Inmediato' },
                    ].map((b, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-slate-600">
                        {b.icon} {b.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Package switcher */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Cambiar paquete</p>
                  <div className="space-y-1.5">
                    {Object.values(PACKAGES_MAP).map(pack => (
                      <Link
                        key={pack.id}
                        to={`/comprar-lumis/checkout/${pack.id}`}
                        onClick={(e) => {
                          if (brickInteracted && paymentSuccess === null) {
                            e.preventDefault();
                            setShowExitWarning(true);
                          }
                        }}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          pack.id === targetPack.id
                            ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                            : 'hover:bg-slate-50 border border-transparent text-slate-600 hover:border-slate-200'
                        }`}
                      >
                        <span>{pack.name}</span>
                        <span className="font-black text-slate-700">${pack.priceCOP.toLocaleString('es-CO')}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Brick */}
              <div ref={brickContainerRef} className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
                <div className="border-b border-slate-100 px-7 py-5 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">Paso 2 de 3</span>
                    <h3 className="text-xl font-black text-slate-900">Elige tu medio de pago</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1">
                      <Lock className="h-3 w-3" /> SSL Seguro
                    </span>
                  </div>
                </div>

                <div className="px-7 py-5 space-y-4">
                  <p className="text-xs text-slate-500 font-semibold bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                    💳 <strong className="text-slate-800">Nequi Débito:</strong> selecciona "Débito" e ingresa los datos de tu Tarjeta Visa Nequi. El cargo se aplica directamente — sin salir de ConexiónLuz.
                  </p>

                  {/* Loading skeleton */}
                  {brickLoading && !brickError && (
                    <div className="space-y-3 py-4">
                      <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                      <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                      <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
                      <div className="h-10 bg-emerald-100 rounded-xl animate-pulse" />
                      <p className="text-center text-xs text-slate-400 font-medium pt-2">Cargando formulario seguro de Mercado Pago…</p>
                    </div>
                  )}

                  {/* Brick error */}
                  {brickError && (
                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center gap-2 text-rose-700">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p className="text-xs font-bold">{brickError}</p>
                      </div>
                      <button
                        onClick={handleRetry}
                        className="inline-flex items-center gap-2 bg-rose-600 text-white text-xs font-black px-5 py-2.5 rounded-xl hover:bg-rose-700 transition-all cursor-pointer"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Reintentar
                      </button>
                    </div>
                  )}

                  {/* Processing overlay */}
                  {processing && (
                    <div className="flex flex-col items-center justify-center py-8 gap-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                      <div className="relative">
                        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
                        <Lock className="h-4 w-4 text-emerald-700 absolute inset-0 m-auto" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-black text-slate-800">Procesando pago…</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">No cierres ni recargues esta página</p>
                      </div>
                    </div>
                  )}

                  {/* MercadoPago Brick container */}
                  <div
                    id="mp-payment-brick"
                    className={processing ? 'hidden' : ''}
                    onClickCapture={() => setBrickInteracted(true)}
                    onKeyDownCapture={() => setBrickInteracted(true)}
                  />
                </div>

                <div className="px-7 pb-5 flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400 border-t border-slate-100 pt-4">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Pagos cifrados SSL procesados por Mercado Pago S.A. — Colombia</span>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
