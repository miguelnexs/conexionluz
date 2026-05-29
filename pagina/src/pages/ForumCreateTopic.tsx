import { useEffect, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { ArrowLeft, Eye, Send, ImageIcon, Lock, Pin, Globe, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ForumCreateTopic = () => {
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('conexionluz:token') : null;
  const isAuthed = Boolean(token);

  // Form states
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState<'text' | 'html'>('text');
  const [bodyText, setBodyText] = useState('');
  const [category, setCategory] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthed) {
      toast.error('Debes iniciar sesión para crear un tema en el foro.');
      navigate('/login', { state: { from: '/foro/nuevo' } });
    }
  }, [isAuthed, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('El título es obligatorio.');
      return;
    }
    if (!bodyText.trim()) {
      toast.error('El cuerpo del tema es obligatorio.');
      return;
    }

    setSubmitting(true);

    try {
      const clientId = localStorage.getItem('conexionluz:clientId');
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', category.trim() || 'General');
      formData.append('isPinned', String(isPinned));
      formData.append('isLocked', String(isLocked));
      formData.append('isActive', String(isActive));

      if (contentType === 'html') {
        formData.append('descriptionHtml', bodyText.trim());
        formData.append('description', '');
      } else {
        formData.append('description', bodyText.trim());
        formData.append('descriptionHtml', '');
      }

      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/public/forum/`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(clientId ? { 'X-Client-Id': clientId } : {}),
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.ok === false) {
        throw new Error(data.error || `Error ${res.status}`);
      }

      toast.success('¡Tema publicado exitosamente!');
      navigate(`/foro/${data.data.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Error al publicar el tema.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthed) return null;

  return (
    <PublicLayout contentClassName="p-0">
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-4 space-y-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
            <div className="space-y-2">
              <button
                onClick={() => navigate('/foro')}
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al foro
              </button>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                  MT
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">Nuevo Tema</h1>
                  <p className="text-xs text-gray-500">Configura el contenido y la visibilidad del foro</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
                className="h-11 px-5 border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-all rounded-xl font-bold flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                {previewMode ? 'Editar Contenido' : 'Vista Previa'}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="h-11 px-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Publicando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Publicar Tema
                  </>
                )}
              </Button>
            </div>
          </div>

          {previewMode ? (
            /* Live Preview Screen */
            <div className="bg-white rounded-3xl border border-gray-200 p-8 space-y-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {isPinned && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-600 border border-amber-200">
                      <Pin className="h-3 w-3" /> Fijado
                    </span>
                  )}
                  {isLocked && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-rose-600 border border-rose-200">
                      <Lock className="h-3 w-3" /> Cerrado
                    </span>
                  )}
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20">
                    {category || 'General'}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">{title || 'Sin Título'}</h1>
              </div>

              {imagePreview && (
                <div className="relative rounded-[2.5rem] overflow-hidden border border-gray-200 max-h-[350px]">
                  <img src={imagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 prose max-w-none">
                {contentType === 'html' ? (
                  <div dangerouslySetInnerHTML={{ __html: bodyText || '<p class="text-gray-400">No hay contenido HTML para previsualizar</p>' }} />
                ) : (
                  <p className="whitespace-pre-wrap text-gray-700">{bodyText || 'Escribe algo en el cuerpo del tema.'}</p>
                )}
              </div>
            </div>
          ) : (
            /* Creation Form Layout */
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 space-y-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Contenido Principal</h3>

                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Título del Tema</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="¿De qué trata esta discusión?"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 text-gray-800 placeholder:text-gray-400 transition-all"
                      required
                    />
                  </div>

                  {/* Body Content */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-500">Cuerpo del Tema</label>

                      {/* Content Type Switch */}
                      <div className="flex bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                        <button
                          type="button"
                          onClick={() => setContentType('text')}
                          className={cn(
                            "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                            contentType === 'text' ? "bg-white text-primary shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"
                          )}
                        >
                          Texto Simple
                        </button>
                        <button
                          type="button"
                          onClick={() => setContentType('html')}
                          className={cn(
                            "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                            contentType === 'html' ? "bg-white text-primary shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"
                          )}
                        >
                          HTML / Pro
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={12}
                      value={bodyText}
                      onChange={(e) => setBodyText(e.target.value)}
                      placeholder={
                        contentType === 'html'
                          ? "<div class='custom-article'>\n  <h2>¡Hola!</h2>\n  <p>Escribe tu contenido en HTML aquí...</p>\n</div>"
                          : "Escribe tu tema o pregunta aquí para que la comunidad pueda responder..."
                      }
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 text-gray-800 placeholder:text-gray-400 transition-all leading-relaxed font-mono"
                      required
                    />
                  </div>

                  {/* Fast HTML Preview Area */}
                  {contentType === 'html' && (
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-primary">Vista Previa Rápida</label>
                      <div className="min-h-24 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs prose max-w-none">
                        {bodyText.trim() ? (
                          <div dangerouslySetInnerHTML={{ __html: bodyText }} />
                        ) : (
                          <p className="text-gray-400 italic">No hay contenido HTML para previsualizar</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Topic Settings */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 space-y-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Ajustes del Tema</h3>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Categoría</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Ej. Meditación, Depresión, Ansiedad"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 text-gray-800 placeholder:text-gray-400 transition-all"
                    />
                  </div>

                  {/* Toggles */}
                  <div className="space-y-4 pt-2">

                    {/* Pinned */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-amber-50/50 hover:border-amber-100 transition-colors">
                      <div className="flex items-center gap-2">
                        <Pin className="h-4 w-4 text-amber-500" />
                        <div>
                          <span className="text-sm font-bold text-gray-800">Fijar Tema</span>
                          <p className="text-[10px] text-gray-500">Mostrar arriba en la lista</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isPinned}
                          onChange={(e) => setIsPinned(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    {/* Locked */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-rose-50/50 hover:border-rose-100 transition-colors">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-rose-500" />
                        <div>
                          <span className="text-sm font-bold text-gray-800">Bloquear Tema</span>
                          <p className="text-[10px] text-gray-500">Cerrar el debate a respuestas</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isLocked}
                          onChange={(e) => setIsLocked(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    {/* Public visibility */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-emerald-50/50 hover:border-emerald-100 transition-colors">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-emerald-500" />
                        <div>
                          <span className="text-sm font-bold text-gray-800">Público</span>
                          <p className="text-[10px] text-gray-500">Visible para toda la comunidad</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={(e) => setIsActive(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>

                  {/* Cover Image Upload */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Imagen de Portada</label>

                    {imagePreview ? (
                      <div className="relative rounded-2xl overflow-hidden border border-gray-200 h-40">
                        <img src={imagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-gray-700 hover:bg-white shadow-sm transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 h-40 cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-all text-gray-400 hover:text-primary">
                        <ImageIcon className="h-8 w-8 mb-2" />
                        <span className="text-xs font-bold">Subir Imagen de Portada</span>
                        <span className="text-[10px] text-gray-400 mt-1">PNG, JPG o GIF</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

            </form>
          )}

        </div>
      </div>
    </PublicLayout>
  );
};

export default ForumCreateTopic;
