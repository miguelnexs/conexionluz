/**
 * Utility functions for generating branded URL slugs and deep links for posts
 * E.g., post ID "5" -> "destello-bHV6OjU"
 */

// Simple base64 encode/decode helper that works in React Native
function toBase64(str: string): string {
  try {
    // If Buffer or btoa is available
    if (typeof btoa === 'function') {
      return btoa(str);
    }
  } catch (e) {}

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  let i = 0;
  while (i < str.length) {
    const chr1 = str.charCodeAt(i++);
    const chr2 = str.charCodeAt(i++);
    const chr3 = str.charCodeAt(i++);

    const enc1 = chr1 >> 2;
    const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    let enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    let enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }

    output +=
      chars.charAt(enc1) +
      chars.charAt(enc2) +
      chars.charAt(enc3) +
      chars.charAt(enc4);
  }
  return output;
}

function fromBase64(str: string): string {
  try {
    if (typeof atob === 'function') {
      return atob(str);
    }
  } catch (e) {}

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  let i = 0;
  const input = str.replace(/[^A-Za-z0-9\+\/\=]/g, '');

  while (i < input.length) {
    const enc1 = chars.indexOf(input.charAt(i++));
    const enc2 = chars.indexOf(input.charAt(i++));
    const enc3 = chars.indexOf(input.charAt(i++));
    const enc4 = chars.indexOf(input.charAt(i++));

    const chr1 = (enc1 << 2) | (enc2 >> 4);
    const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const chr3 = ((enc3 & 3) << 6) | enc4;

    output += String.fromCharCode(chr1);

    if (enc3 !== 64) {
      output += String.fromCharCode(chr2);
    }
    if (enc4 !== 64) {
      output += String.fromCharCode(chr3);
    }
  }
  return output;
}

export function encodePostSlug(id: string | number): string {
  const strId = String(id);
  if (!strId) return '';
  if (strId.startsWith('destello-')) return strId;

  try {
    const encoded = toBase64(`luz:${strId}`)
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
    const decoded = fromBase64(raw);
    if (decoded.startsWith('luz:')) {
      return decoded.replace('luz:', '');
    }
  } catch {
    // Fallback
  }

  return slug.replace(/^destello-|^pub-/, '');
}

export function getPostShareUrl(postId: string | number): string {
  const slug = encodePostSlug(postId);
  return `https://conexionluz.com/#/publicacion/${slug}`;
}
