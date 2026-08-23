import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, CheckCircle, Sparkles, MessageCircle, AlertTriangle, X, ShoppingBag, Wallet } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import DatePicker from '../components/DatePicker';
import TimeSlots from '../components/TimeSlots';
import PatientForm from '../components/PatientForm';
import { useCreateAppointment } from '../hooks/useAppointments';
import { useToast } from '../hooks/use-toast';
import { useServices } from '../hooks/useServices';
import { useTherapists } from '../hooks/useTherapists';
import { api } from '../api/client';
import type { Service, Therapist } from '@/types/models';

import { getLumiPriceForService, notifyLumiBalanceUpdated } from '@/utils/lumiPricing';

interface AgendaStep {
  id: number;
  title: string;
  icon: React.ElementType;
  completed: boolean;
}

const Agenda = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const createAppointmentMutation = useCreateAppointment();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('conexionluz:token') : null;
  const isAuthed = Boolean(token);
  const { data: services = [], isLoading: loadingServices } = useServices();
  const serviceIdFromUrl = searchParams.get('service') ? Number(searchParams.get('service')) : null;
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    typeof serviceIdFromUrl === 'number' && Number.isFinite(serviceIdFromUrl) ? serviceIdFromUrl : null
  );
  const { data: therapists = [], isLoading: loadingTherapists } = useTherapists();
  const therapistIdFromUrl = searchParams.get('therapist') ? Number(searchParams.get('therapist')) : null;
  const [selectedTherapistId, setSelectedTherapistId] = useState<number | null>(
    typeof therapistIdFromUrl === 'number' && Number.isFinite(therapistIdFromUrl) ? therapistIdFromUrl : null
  );
  const [me, setMe] = useState<{ firstName: string; lastName: string; email: string; phone: string } | null>(null);
  const [patientData, setPatientData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    emergency_contact: '',
    emergency_phone: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lumiModalOpen, setLumiModalOpen] = useState(false);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [isSpendingLumi, setIsSpendingLumi] = useState(false);

  const selectedService = useMemo(() => {
    if (!selectedServiceId) return null;
    return (
      (services as Service[]).find(
        (s) =>
          String(s.id) === String(selectedServiceId) ||
          s.title.toLowerCase() === String(selectedServiceId).toLowerCase()
      ) || null
    );
  }, [services, selectedServiceId]);

  const selectedTherapist = useMemo(() => {
    if (!selectedTherapistId) return null;
    return (therapists as Therapist[]).find((t) => String(t.id) === String(selectedTherapistId)) || null;
  }, [therapists, selectedTherapistId]);

  const requiredLumis = useMemo(() => {
    if (!selectedService) return 0;
    const price = selectedService.priceCOP || (selectedService as any).price_cop || 0;
    return getLumiPriceForService(price);
  }, [selectedService]);

  const fetchUserBalance = async () => {
    setLoadingBalance(true);
    let bal = 0;
    try {
      if (isAuthed) {
        const res = await api.get<{ balance: number }>('/api/portal/lumi/wallet/');
        if (res.ok && res.data && typeof res.data.balance === 'number') {
          bal = res.data.balance;
          localStorage.setItem('conexionluz:lumi_wallet_balance', String(bal));
        }
      } else {
        const cached = localStorage.getItem('conexionluz:lumi_wallet_balance');
        if (cached) bal = Number(cached);
      }
    } catch (e) {
      console.error('Error fetching wallet:', e);
    } finally {
      setUserBalance(bal);
      setLoadingBalance(false);
    }
  };

  const openLumiConfirmation = async () => {
    await fetchUserBalance();
    setLumiModalOpen(true);
  };

  const focusForCalendar = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    : null;

  useEffect(() => {
    const handleLumiUpdate = (e: Event) => {
      const customEv = e as CustomEvent;
      if (typeof customEv.detail === 'number') {
        setUserBalance(customEv.detail);
      }
    };
    window.addEventListener('lumi-balance-updated', handleLumiUpdate);
    return () => window.removeEventListener('lumi-balance-updated', handleLumiUpdate);
  }, []);

  useEffect(() => {
    if (!isAuthed) return;
    void (async () => {
      const res = await api.get<{ firstName: string; lastName: string; email: string; phone: string }>('/api/portal/me/');
      if (res.ok) setMe(res.data);
    })();
  }, [isAuthed]);

  useEffect(() => {
    if (!services.length) return;
    if (selectedServiceId) return;
    if (typeof serviceIdFromUrl === 'number' && Number.isFinite(serviceIdFromUrl)) {
      const exists = services.some((s) => s.id === serviceIdFromUrl);
      if (exists) setSelectedServiceId(serviceIdFromUrl);
    }
  }, [services, selectedServiceId, serviceIdFromUrl]);

  useEffect(() => {
    if (!therapists.length) return;
    if (selectedTherapistId) return;
    if (typeof therapistIdFromUrl === 'number' && Number.isFinite(therapistIdFromUrl)) {
      const exists = therapists.some((t) => Number(t.id) === therapistIdFromUrl);
      if (exists) setSelectedTherapistId(therapistIdFromUrl);
    }
  }, [therapists, selectedTherapistId, therapistIdFromUrl]);

  const steps: AgendaStep[] = useMemo(() => {
    if (isAuthed) {
      return [
        { id: 1, title: 'Servicio y fecha', icon: Calendar, completed: !!selectedDate && !!selectedServiceId && !!selectedTherapistId },
        { id: 2, title: 'Elegir Horario', icon: Clock, completed: !!selectedTime },
        { id: 3, title: 'Confirmación', icon: CheckCircle, completed: false }
      ];
    }
    return [
      { id: 1, title: 'Servicio y fecha', icon: Calendar, completed: !!selectedDate && !!selectedServiceId && !!selectedTherapistId },
      { id: 2, title: 'Elegir Horario', icon: Clock, completed: !!selectedTime },
      { id: 3, title: 'Datos Personales', icon: User, completed: false },
      { id: 4, title: 'Confirmación', icon: CheckCircle, completed: false }
    ];
  }, [isAuthed, selectedDate, selectedServiceId, selectedTherapistId, selectedTime]);

  const handleNext = async () => {
    const shouldCreate = isAuthed ? currentStep === 2 : currentStep === 3;

    if (shouldCreate && isStepValid()) {
      await openLumiConfirmation();
    } else if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleConfirmBookingWithLumi = async () => {
    setIsSpendingLumi(true);
    try {
      const successStep = isAuthed ? 3 : 4;
      const [hours, minutes] = selectedTime.split(':').map((x) => Number(x));
      const start = new Date(selectedDate!);
      start.setHours(hours || 0, minutes || 0, 0, 0);

      // Si requiere Lumis y está autenticado, hacer el cobro
      if (requiredLumis > 0 && isAuthed) {
        const spendRes = await api.post<{ balance?: number }>('/api/portal/lumi/spend/', {
          itemType: 'appointment',
          itemId: `appointment-${selectedServiceId}-${Date.now()}`,
          lumiAmount: requiredLumis,
          description: `Cita de servicio: ${selectedService?.title || 'Terapia'}`
        });

        if (!spendRes.ok) {
          const errMsg = (spendRes as any).error || "No tienes suficientes Lumis para agendar esta cita.";
          toast({
            title: "Saldo Insuficiente de Lumis",
            description: errMsg,
            variant: "destructive"
          });
          setIsSpendingLumi(false);
          return;
        }

        if (spendRes.data?.balance !== undefined) {
          setUserBalance(spendRes.data.balance);
          notifyLumiBalanceUpdated(spendRes.data.balance);
        }
      }

      // Crear cita en backend
      if (isAuthed) {
        await createAppointmentMutation.mutateAsync({
          startAt: start.toISOString(),
          serviceId: selectedServiceId || undefined,
          therapistId: selectedTherapistId || undefined
        });
      } else {
        await createAppointmentMutation.mutateAsync({
          startAt: start.toISOString(),
          serviceId: selectedServiceId || undefined,
          therapistId: selectedTherapistId || undefined,
          clientName: patientData.name,
          clientEmail: patientData.email,
          clientPhone: patientData.phone,
          clientAge: patientData.age ? parseInt(patientData.age) : undefined,
          emergencyContactName: patientData.emergency_contact || undefined,
          emergencyContactPhone: patientData.emergency_phone || undefined,
          reason: patientData.reason,
          notes: ''
        });
      }

      toast({
        title: "¡Cita agendada exitosamente!",
        description: requiredLumis > 0 ? `Se han deducido ✨ ${requiredLumis} Lumis de tu saldo.` : 'Tu cita ha sido registrada en nuestro sistema.',
      });

      setLumiModalOpen(false);
      setCurrentStep(successStep);
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Error al agendar la cita",
        description: "Hubo un problema al guardar tu cita. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSpendingLumi(false);
    }
  };

  const handleRedirectWhatsApp = () => {
    const clientName = isAuthed && me ? `${me.firstName} ${me.lastName}`.trim() : patientData.name || 'Cliente';
    const clientPhone = isAuthed && me ? me.phone : patientData.phone || 'Sin especificar';
    const dateFormatted = selectedDate
      ? selectedDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      : 'A convenir';

    const message = `Hola ConexiónLuz 🌟, deseo agendar una cita para mi servicio y coordinar la confirmación:

📋 *Detalles de la Cita:*
- *Servicio:* ${selectedService?.title || 'Consulta Terapéutica'}
- *Terapeuta:* ${selectedTherapist?.name || 'Por asignar'}
- *Fecha:* ${dateFormatted}
- *Hora:* ${selectedTime || 'A convenir'}
- *Inversión:* ✨ ${requiredLumis} Lumis (${selectedService?.priceCOP ? `$${selectedService.priceCOP.toLocaleString('es-CO')} COP` : 'Consulta'})
- *Paciente:* ${clientName}
- *Teléfono de Contacto:* ${clientPhone}

¡Quedo atento(a) para agendar mi cita!`;

    const url = `https://wa.me/573013317868?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return !!selectedDate && !!selectedServiceId && !!selectedTherapistId;
      case 2: return !!selectedTime;
      case 3: return isAuthed ? true : (patientData.name && patientData.email && patientData.phone);
      default: return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-800">Servicio</div>
              {loadingServices ? (
                <div className="text-sm text-gray-600">Cargando servicios...</div>
              ) : services.length === 0 ? (
                <div className="text-sm text-gray-600">No hay servicios disponibles.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(services as Service[])
                    .filter((s) => s.isActive !== false)
                    .map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedServiceId(s.id)}
                        className={`rounded-2xl border p-4 text-left transition-all ${
                          selectedServiceId === s.id ? 'border-primary/40 bg-primary/10' : 'border-gray-200 bg-white hover:shadow-sm'
                        }`}
                      >
                        <div className="text-sm font-bold text-gray-800">{s.title}</div>
                        {s.description ? <div className="mt-1 text-sm text-gray-600 line-clamp-2">{s.description}</div> : null}
                        <div className="mt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1.5 flex-wrap">
                          <span>{typeof s.durationMinutes === 'number' && s.durationMinutes > 0 ? `${s.durationMinutes} min` : 'Duración a confirmar'}</span>
                          {typeof s.priceCOP === 'number' && s.priceCOP > 0 ? (
                            <span className="bg-emerald-50 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                              ✨ {getLumiPriceForService(s.priceCOP).toLocaleString('es-CO')} Lumis
                            </span>
                          ) : null}
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-800">Profesional (Terapeuta)</div>
              {loadingTherapists ? (
                <div className="text-sm text-gray-600">Cargando terapeutas...</div>
              ) : therapists.length === 0 ? (
                <div className="text-sm text-gray-600">No hay profesionales disponibles en este momento.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(therapists as Therapist[]).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTherapistId(Number(t.id))}
                      className={`rounded-2xl border p-4 text-left transition-all flex flex-col justify-between ${
                        selectedTherapistId === Number(t.id) ? 'border-primary/40 bg-primary/10' : 'border-gray-200 bg-white hover:shadow-sm'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-bold text-gray-800">{t.name}</div>
                        <div className="text-xs text-primary font-medium mt-0.5">{t.specialty}</div>
                        {t.description ? <div className="mt-1.5 text-xs text-gray-600 line-clamp-2">{t.description}</div> : null}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-800">Fecha</div>
              <DatePicker selectedDate={selectedDate} onDateSelect={setSelectedDate} />
            </div>

            {isAuthed && me ? (
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
                Agendando como <strong>{`${me.firstName} ${me.lastName}`.trim()}</strong>
                {me.email ? <span className="ml-2">· {me.email}</span> : null}
              </div>
            ) : null}
          </div>
        );
      case 2:
        return (
          <TimeSlots 
            selectedTime={selectedTime} 
            onTimeSelect={setSelectedTime}
            selectedDate={selectedDate}
            serviceId={selectedServiceId || undefined}
            therapistId={selectedTherapistId || undefined}
          />
        );
      case 3:
        if (isAuthed) {
          return (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-scale-in">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">¡Cita Agendada!</h3>
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 space-y-3">
                <p className="text-gray-600">
                  <strong>Fecha:</strong> {selectedDate?.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-gray-600">
                  <strong>Hora:</strong> {selectedTime}
                </p>
                <p className="text-gray-600">
                  <strong>Paciente:</strong> {me ? `${me.firstName} ${me.lastName}`.trim() : '—'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate(focusForCalendar ? `/mi-calendario?focus=${encodeURIComponent(focusForCalendar)}` : '/mi-calendario')}
                  className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary/10 transition-all duration-300"
                >
                  Ver mi calendario
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Volver al Inicio
                </button>
              </div>
            </div>
          );
        }
        return <PatientForm data={patientData} onChange={setPatientData} />;
      case 4:
        return (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-scale-in">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">¡Cita Agendada!</h3>
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 space-y-3">
              <p className="text-gray-600">
                <strong>Fecha:</strong> {selectedDate?.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-gray-600">
                <strong>Hora:</strong> {selectedTime}
              </p>
              <p className="text-gray-600">
                <strong>Paciente:</strong> {isAuthed && me ? `${me.firstName} ${me.lastName}`.trim() : patientData.name}
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Volver al Inicio
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <PublicLayout contentClassName="p-0">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/70 rounded-lg transition-colors duration-200 group"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Agendar consulta
          </h1>
        </div>
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
            
            {steps.map((step, index) => (
              <div key={step.id} className="relative flex flex-col items-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 transform
                  ${currentStep >= step.id 
                    ? 'bg-gradient-to-r from-primary to-accent border-white text-white scale-110 animate-pulse-slow' 
                    : 'bg-white border-gray-300 text-gray-400'
                  }
                `}>
                  <step.icon className="h-5 w-5" />
                </div>
                <span className={`
                  mt-2 text-sm font-medium transition-colors duration-300
                  ${currentStep >= step.id ? 'text-primary' : 'text-gray-500'}
                `}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {steps[currentStep - 1].title}
              </h2>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Content */}
            <div className="mb-8">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            {currentStep < steps.length && (
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`
                    px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105
                    ${currentStep === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                    }
                  `}
                >
                  Anterior
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={!isStepValid() || isSubmitting}
                  className={`
                    px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105
                    ${isStepValid() && !isSubmitting
                      ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {isSubmitting
                    ? 'Guardando...'
                    : isAuthed
                      ? (currentStep === 2 ? 'Agendar' : 'Siguiente')
                      : (currentStep === 3 ? 'Confirmar Cita' : 'Siguiente')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lumi Payment & WhatsApp Modal */}
      {lumiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden animate-scale-in">
            {/* Header decoration */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />
            
            <button
              onClick={() => setLumiModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3 mb-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Confirmación de Cita con Lumis
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Revisa los detalles de tu agendamiento y confirma la inversión en moneda Lumi (✨).
              </p>
            </div>

            {/* Appointment Details Box */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5 text-xs text-slate-700 mb-5">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span className="font-semibold text-slate-500">Servicio:</span>
                <span className="font-bold text-slate-900 text-right">{selectedService?.title || 'Servicio Terapéutico'}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span className="font-semibold text-slate-500">Profesional:</span>
                <span className="font-bold text-slate-900 text-right">{selectedTherapist?.name || 'Terapeuta asignado'}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span className="font-semibold text-slate-500">Fecha y Hora:</span>
                <span className="font-bold text-slate-900 text-right">
                  {selectedDate ? selectedDate.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric' }) : ''} · {selectedTime}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="font-bold text-slate-900">Inversión en la cita:</span>
                <span className="font-black text-emerald-800 text-sm bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                  ✨ {requiredLumis} Lumis
                </span>
              </div>
            </div>

            {/* Wallet Balance Status */}
            <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/70 mb-6">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-emerald-600" /> Tu Saldo Disponible:
                </span>
                <span className="font-black text-slate-900 text-sm">
                  ✨ {loadingBalance ? 'Cargando...' : `${userBalance} Lumis`}
                </span>
              </div>
            </div>

            {/* Condition Check: HAS LUMIS vs INSUFFICIENT LUMIS */}
            {userBalance >= requiredLumis ? (
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 p-3 rounded-xl text-center border border-emerald-200">
                  ✅ Saldo suficiente disponible. Tu saldo tras agendar será de ✨ {userBalance - requiredLumis} Lumis.
                </div>

                <button
                  onClick={handleConfirmBookingWithLumi}
                  disabled={isSpendingLumi}
                  className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm py-4 px-4 rounded-2xl shadow-lg shadow-emerald-600/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSpendingLumi ? (
                    'Procesando cobro de Lumis...'
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Confirmar Cita y Pagar ✨ {requiredLumis} Lumis
                    </>
                  )}
                </button>

                <button
                  onClick={() => setLumiModalOpen(false)}
                  className="w-full text-xs font-bold text-slate-500 hover:text-slate-800 py-2 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                  <div className="font-black flex items-center gap-1.5 text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" /> Saldo Insuficiente en Moneda Lumi
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    Requieres <strong>✨ {requiredLumis} Lumis</strong> para agendar directamente en línea (tienes ✨ {userBalance} Lumis). Puedes agendar por WhatsApp con nuestro asesor y coordinar tu cita con todos tus datos precargados.
                  </p>
                </div>

                <button
                  onClick={handleRedirectWhatsApp}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-4 px-4 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-current" /> Agendar por WhatsApp con un Asesor
                </button>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => navigate('/comprar-lumis')}
                    className="flex-1 bg-slate-900 hover:bg-black text-white font-bold text-xs py-3 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" /> Recargar Lumis
                  </button>
                  <button
                    onClick={() => setLumiModalOpen(false)}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </PublicLayout>
  );
};

export default Agenda;
