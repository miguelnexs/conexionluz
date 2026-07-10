import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '@/api/client';
import { Upload, ImageIcon, X } from 'lucide-react';

interface Story {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  author: string;
  category: string;
  tags: string[];
  patientId: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function HistoriaFormPage({ mode = 'create' }: { mode?: 'create' | 'edit' }): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = mode === 'edit';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  // Load existing story when editing
  useEffect(() => {
    if (!isEdit || !id) return;
    const load = async () => {
      setLoadingData(true);
      const res = await api.get<Story>(`/api/stories/${id}/`);
      if (!res.ok) {
        setError(res.error);
        setLoadingData(false);
        return;
      }
      const s = res.data;
      setTitle(s.title);
      setContent(s.content);
      setAuthor(s.author || '');
      setCategory(s.category || '');
      setTags(s.tags?.join(', ') || '');
      if (s.imageUrl) setImagePreview(s.imageUrl);
      setLoadingData(false);
    };
    void load();
  }, [isEdit, id]);

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      setRemoveImage(false);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('content', content.trim());
    formData.append('author', author.trim());
    formData.append('category', category.trim());
    formData.append('tags', tags);
    formData.append('isActive', 'true');
    if (imageFile) {
      formData.append('imageFile', imageFile);
    } else if (removeImage) {
      formData.append('removeImage', 'true');
    }

    const res = isEdit
      ? await api.patchForm<Story>(`/api/stories/${id}/`, formData)
      : await api.postForm<Story>('/api/stories/', formData);

    if (!res.ok) {
      setError(res.error);
      setLoading(false);
      return;
    }
    navigate(isEdit ? `/historia/${id}` : '/historia');
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto"
    >
      <motion.div variants={item} className="mb-6">
        <button
          onClick={() => navigate(isEdit ? `/historia/${id}` : '/historia')}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          ← {isEdit ? 'Volver al detalle' : 'Volver a Historias'}
        </button>
      </motion.div>

      <motion.h1
        variants={item}
        className="text-3xl md:text-4xl font-bold text-center mb-8"
      >
        {isEdit ? 'Editar Historia' : 'Añadir Nueva Historia'}
      </motion.h1>

      {loadingData && (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <motion.div
          variants={item}
          className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-center mb-6"
        >
          {error}
        </motion.div>
      )}

      {!loadingData && (
      <motion.form
        variants={item}
        onSubmit={handleSubmit}
        className="p-6 md:p-8 rounded-2xl bg-card/70 backdrop-blur-sm border shadow-sm space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="story-title">
              Título *
            </label>
            <input
              id="story-title"
              type="text"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 bg-background/50 backdrop-blur-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Escribe un título"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="story-author">
              Autor
            </label>
            <input
              id="story-author"
              type="text"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 bg-background/50 backdrop-blur-sm"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Nombre del autor"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="story-category">
              Categoría
            </label>
            <input
              id="story-category"
              type="text"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 bg-background/50 backdrop-blur-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Categoría de la historia"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Imagen (opcional)
            </label>
            {imagePreview ? (
              <div className="relative group rounded-xl overflow-hidden border h-40">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white/90 text-xs font-semibold text-gray-800 hover:bg-white transition-colors">
                    Cambiar
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e.target.files?.[0] || null)} disabled={loading} />
                  </label>
                  <button type="button" onClick={handleRemoveImage} className="p-1.5 rounded-lg bg-red-500/90 text-white hover:bg-red-600 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <label
                className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleImageChange(e.dataTransfer.files?.[0] || null); }}
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Arrastra o haz clic para subir</span>
                <span className="text-xs text-muted-foreground/60 mt-1">JPG, PNG, WebP</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e.target.files?.[0] || null)} disabled={loading} />
              </label>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2" htmlFor="story-tags">
              Etiquetas (separadas por coma)
            </label>
            <input
              id="story-tags"
              type="text"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 bg-background/50 backdrop-blur-sm"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="etiqueta1, etiqueta2, etiqueta3"
              disabled={loading}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2" htmlFor="story-content">
              Contenido (HTML permitido) *
            </label>
            <textarea
              id="story-content"
              className="w-full h-40 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 bg-background/50 backdrop-blur-sm resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe tu historia aquí. Puedes usar HTML: <strong>negrita</strong>, <em>cursiva</em>, <br> para saltos de línea, etc."
              required
              disabled={loading}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(isEdit ? `/historia/${id}` : '/historia')}
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/90 transition-all duration-200"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            {loading ? (isEdit ? 'Guardando...' : 'Añadiendo...') : (isEdit ? 'Guardar Cambios' : 'Añadir Historia')}
          </button>
        </div>
      </motion.form>
      )}
    </motion.div>
  );
}

export default HistoriaFormPage;