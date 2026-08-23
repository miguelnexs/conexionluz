import React, { useState } from 'react';
import { 
  Columns2, 
  Sparkles, 
  Brain, 
  Eye, 
  Radio, 
  Activity, 
  Heart, 
  Volume2, 
  Compass, 
  CheckCircle2,
  RefreshCw,
  Layers
} from 'lucide-react';

export default function MAPInternoExterno() {
  const [balance, setBalance] = useState<number>(50); // 50 = perfectly centered
  
  // Real-time interactive field states
  const [interno, setInterno] = useState({
    pensamiento: '',
    emocion: '',
    cuerpo: '',
    impulso: ''
  });

  const [externo, setExterno] = useState({
    sonidos: '',
    imagenes: '',
    personas: '',
    situacion: ''
  });

  const [presenteSintesis, setPresenteSintesis] = useState('');
  const [savedRecords, setSavedRecords] = useState<Array<{
    id: string;
    date: string;
    balance: number;
    interno: typeof interno;
    externo: typeof externo;
    presente: string;
  }>>([]);

  const handleSaveSimultaneity = () => {
    if (!interno.pensamiento && !externo.situacion && !presenteSintesis) return;
    const newRec = {
      id: 'rec-' + Date.now(),
      date: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      balance,
      interno: { ...interno },
      externo: { ...externo },
      presente: presenteSintesis || 'Integración consciente en el presente.'
    };
    setSavedRecords([newRec, ...savedRecords]);
  };

  const handleClear = () => {
    setInterno({ pensamiento: '', emocion: '', cuerpo: '', impulso: '' });
    setExterno({ sonidos: '', imagenes: '', personas: '', situacion: '' });
    setPresenteSintesis('');
    setBalance(50);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/20 border border-teal-400/30 text-teal-200 px-3.5 py-1 rounded-full flex items-center gap-1.5">
            <Columns2 className="h-3.5 w-3.5 text-teal-300" />
            ENTRENADOR DE SIMULTANEIDAD
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="text-xs font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Limpiar
            </button>
            <button
              onClick={handleSaveSimultaneity}
              className="text-xs font-black text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 px-4 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1"
            >
              <CheckCircle2 className="h-4 w-4" /> Guardar Registro
            </button>
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          Herramienta: Interno + Externo
        </h2>
        <p className="text-teal-100 text-xs sm:text-sm font-medium mt-1 leading-relaxed max-w-3xl">
          Pantalla dividida conceptual para registrar simultáneamente lo que ocurre dentro de ti y fuera de ti, anclados en el centro unificador del momento presente.
        </p>
      </div>

      {/* Balance Slider: Internal vs External Attention */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Brain className="h-4 w-4 text-indigo-600" />
            <span className="text-xs font-black text-indigo-950 uppercase">
              Atención Interna ({100 - balance}%)
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-xs font-black text-teal-900 flex items-center gap-1">
            <Compass className="h-3.5 w-3.5 text-teal-600" />
            <span>{balance === 50 ? '⚖️ Equilibrio 50/50' : balance < 50 ? 'Foco más Interno' : 'Foco más Externo'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-emerald-950 uppercase">
              Atención Externa ({balance}%)
            </span>
            <Eye className="h-4 w-4 text-emerald-600" />
          </div>
        </div>

        <input
          type="range"
          min="10"
          max="90"
          value={balance}
          onChange={(e) => setBalance(Number(e.target.value))}
          className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
        />
        <p className="text-center text-[11px] text-slate-500 font-medium">
          Mueve el control para calibrar conscientemente dónde está posada tu linterna atencional en este instante.
        </p>
      </div>

      {/* Split-Screen Canvas: Left (Interno), Center (Presente), Right (Externo) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Left: Realidad Interna (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-indigo-50/70 to-purple-50/50 border-2 border-indigo-200/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-indigo-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧠</span>
                <div>
                  <h3 className="text-base font-black text-indigo-950">Realidad Interna</h3>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase">Mundo Subjetivo</span>
                </div>
              </div>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900">
                Adentro
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-indigo-950 block mb-1">Pensamiento</label>
                <input
                  type="text"
                  placeholder="¿Qué frase o imagen cruza tu mente?"
                  value={interno.pensamiento}
                  onChange={(e) => setInterno({ ...interno, pensamiento: e.target.value })}
                  className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-indigo-950 block mb-1">Emoción</label>
                <input
                  type="text"
                  placeholder="¿Qué tono afectivo sientes?"
                  value={interno.emocion}
                  onChange={(e) => setInterno({ ...interno, emocion: e.target.value })}
                  className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-indigo-950 block mb-1">Cuerpo / Sensación</label>
                <input
                  type="text"
                  placeholder="¿Qué sientes físicamente (tensión, calor, respiración)?"
                  value={interno.cuerpo}
                  onChange={(e) => setInterno({ ...interno, cuerpo: e.target.value })}
                  className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-indigo-950 block mb-1">Impulso Automático</label>
                <input
                  type="text"
                  placeholder="¿Qué ganas de actuar o reaccionar notas?"
                  value={interno.impulso}
                  onChange={(e) => setInterno({ ...interno, impulso: e.target.value })}
                  className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center: Conexión Presente (2 Cols) */}
        <div className="lg:col-span-2 bg-gradient-to-b from-teal-900 to-slate-900 text-white rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-between text-center space-y-4 shadow-md">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-300">
              PUNTO DE UNIÓN
            </span>
            <h4 className="text-base font-black text-white">EL PRESENTE</h4>
          </div>

          <div className="w-12 h-12 rounded-full bg-teal-500/20 border border-teal-400 flex items-center justify-center text-teal-300">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>

          <div className="w-full space-y-2">
            <label className="text-[10px] font-black uppercase text-teal-200 block">
              Síntesis de Presencia
            </label>
            <textarea
              rows={3}
              placeholder="Estoy observando lo interno y lo externo a la vez..."
              value={presenteSintesis}
              onChange={(e) => setPresenteSintesis(e.target.value)}
              className="w-full p-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 font-medium"
            />
          </div>
        </div>

        {/* Right: Realidad Externa (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-emerald-50/70 to-teal-50/50 border-2 border-emerald-200/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌍</span>
                <div>
                  <h3 className="text-base font-black text-emerald-950">Realidad Externa</h3>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Mundo Circundante</span>
                </div>
              </div>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                Afuera
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-emerald-950 block mb-1">Sonidos del Entorno</label>
                <input
                  type="text"
                  placeholder="¿Qué ruidos lejanos o cercanos percibes?"
                  value={externo.sonidos}
                  onChange={(e) => setExterno({ ...externo, sonidos: e.target.value })}
                  className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-emerald-950 block mb-1">Imágenes / Luz / Espacio</label>
                <input
                  type="text"
                  placeholder="¿Qué colores, texturas o fuentes de luz ves?"
                  value={externo.imagenes}
                  onChange={(e) => setExterno({ ...externo, imagenes: e.target.value })}
                  className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-emerald-950 block mb-1">Personas / Dinámicas</label>
                <input
                  type="text"
                  placeholder="¿Quiénes están alrededor o qué tono hay?"
                  value={externo.personas}
                  onChange={(e) => setExterno({ ...externo, personas: e.target.value })}
                  className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-emerald-950 block mb-1">Situación Objetiva</label>
                <input
                  type="text"
                  placeholder="¿Qué está aconteciendo objetivamente?"
                  value={externo.situacion}
                  onChange={(e) => setExterno({ ...externo, situacion: e.target.value })}
                  className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* History of Saved Simultaneity Snapshots */}
      {savedRecords.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">
            Registros de Simultaneidad Guardados ({savedRecords.length})
          </h3>
          <div className="space-y-3">
            {savedRecords.map((rec) => (
              <div key={rec.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="font-black text-slate-700">Captura a las {rec.date}</span>
                  <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                    Atención: {100 - rec.balance}% Interna / {rec.balance}% Externa
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100">
                    <span className="font-bold text-indigo-900 block">🧠 Interno:</span>
                    <p className="text-indigo-800 mt-0.5">{rec.interno.pensamiento || rec.interno.emocion || 'Sin detalles'}</p>
                  </div>
                  <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                    <span className="font-bold text-emerald-900 block">🌍 Externo:</span>
                    <p className="text-emerald-800 mt-0.5">{rec.externo.situacion || rec.externo.sonidos || 'Sin detalles'}</p>
                  </div>
                </div>
                <p className="text-slate-700 font-semibold italic pt-1">"{rec.presente}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
