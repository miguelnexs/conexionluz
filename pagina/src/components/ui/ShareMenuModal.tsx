import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Facebook,
  Instagram,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { encodePostSlug } from '@/utils/postSlug';
import { useToast } from '@/components/ui/use-toast';

interface ShareMenuModalProps {
  postId: string;
  postContent?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareMenuModal: React.FC<ShareMenuModalProps> = ({
  postId,
  postContent,
  isOpen,
  onClose
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !postId) return null;

  const slug = encodePostSlug(postId);
  const shareUrl = `${window.location.origin}/#/publicacion/${slug}`;
  const shareText = postContent
    ? `Mira este destello en Conexión Luz: "${postContent.slice(0, 80)}${postContent.length > 80 ? '...' : ''}"`
    : 'Mira este destello de bienestar en Conexión Luz';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: '¡Enlace copiado!',
      description: 'El enlace permanente se guardó en tu portapapeles. 🌿'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  const handleInstagram = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: '¡Enlace copiado para Instagram!',
      description: 'Copiado al portapapeles. Abre Instagram y pégalo en tu historia o mensaje. 📸'
    });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[999999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200/90 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Share2 className="h-4 w-4" />
            </div>
            <h3 className="font-black text-slate-900 text-sm md:text-base">Compartir Destello</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Share buttons options */}
        <div className="grid grid-cols-2 gap-3">
          {/* WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 text-emerald-900 font-bold text-xs transition-all shadow-xs group cursor-pointer"
          >
            <div className="h-8 w-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <MessageCircle className="h-4 w-4 fill-white/20" />
            </div>
            <div className="text-left">
              <span className="block font-black text-emerald-800">WhatsApp</span>
              <span className="text-[10px] text-emerald-600 font-medium">Enviar chat</span>
            </div>
          </button>

          {/* Facebook */}
          <button
            type="button"
            onClick={handleFacebook}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200/80 text-blue-900 font-bold text-xs transition-all shadow-xs group cursor-pointer"
          >
            <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <Facebook className="h-4 w-4 fill-white" />
            </div>
            <div className="text-left">
              <span className="block font-black text-blue-800">Facebook</span>
              <span className="text-[10px] text-blue-600 font-medium">Publicar en muro</span>
            </div>
          </button>

          {/* Instagram */}
          <button
            type="button"
            onClick={handleInstagram}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 hover:opacity-90 border border-pink-200/80 text-slate-800 font-bold text-xs transition-all shadow-xs group cursor-pointer"
          >
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <Instagram className="h-4 w-4" />
            </div>
            <div className="text-left">
              <span className="block font-black text-pink-900">Instagram</span>
              <span className="text-[10px] text-pink-600 font-medium">Copiar para IG</span>
            </div>
          </button>

          {/* Copy direct link */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-800 font-bold text-xs transition-all shadow-xs group cursor-pointer"
          >
            <div className="h-8 w-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </div>
            <div className="text-left">
              <span className="block font-black text-slate-800">{copied ? '¡Copiado!' : 'Copiar Enlace'}</span>
              <span className="text-[10px] text-slate-500 font-medium">Link directo</span>
            </div>
          </button>
        </div>

        {/* Link preview box */}
        <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-mono text-slate-600 overflow-hidden">
          <span className="truncate flex-1 text-[11px] select-all">{shareUrl}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 font-sans font-bold text-[10px] bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            {copied ? '✓ Listo' : 'Copiar'}
          </button>
        </div>

      </div>
    </div>
  );
};
