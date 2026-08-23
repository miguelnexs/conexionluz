/**
 * Utility functions for generating branded encrypted-looking URLs for posts
 * E.g., post ID "5" -> "destello-bHV6OjU"
 */

export function encodePostSlug(id: string | number): string {
  const strId = String(id);
  if (!strId) return '';
  if (strId.startsWith('destello-')) return strId;

  try {
    const encoded = btoa(`luz:${strId}`)
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    return `destello-${encoded}`;
  } catch {
    return `destello-${strId}`;
  }
}

export function decodePostSlug(slug?: string): string {
  if (!slug) return '';
  if (!slug.startsWith('destello-') && !slug.startsWith('pub-')) {
    return slug;
  }

  const raw = slug
    .replace(/^destello-|^pub-/, '')
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  try {
    const decoded = atob(raw);
    if (decoded.startsWith('luz:')) {
      return decoded.replace('luz:', '');
    }
  } catch {
    // If decoding fails, return original slug minus prefix
  }

  return slug.replace(/^destello-|^pub-/, '');
}
