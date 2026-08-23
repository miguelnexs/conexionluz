import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(isoString?: string | null): string {
  if (!isoString) return 'Hace un momento';
  const str = String(isoString).trim();
  if (!str) return 'Hace un momento';
  
  if (
    str.startsWith('Hace ') ||
    str === 'Ahora' ||
    str === 'reciente' ||
    str === 'Ayer'
  ) {
    return str;
  }

  const date = new Date(str);
  if (isNaN(date.getTime())) return str;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 30) return 'Hace un momento';
  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} d`;

  return date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: diffDays > 300 ? 'numeric' : undefined,
  });
}

