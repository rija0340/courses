/** Shared image upload constants & helpers for vocab Storage. */

export const IMAGE_BUCKET = 'vocab-images';

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

export const ACCEPTED_IMAGE_ACCEPT =
  'image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml,.jpg,.jpeg,.png,.webp,.gif,.svg';

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB (matches supabase_schema.sql)

const EXT_BY_MIME = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
};

export function isAcceptedImageType(mime) {
  return ACCEPTED_IMAGE_TYPES.includes(mime);
}

export function extFromMime(mime) {
  return EXT_BY_MIME[mime] || 'bin';
}

/** Convert a data URL (from FileReader) into a Blob + mime. */
export function dataUrlToBlob(dataUrl) {
  const str = String(dataUrl);
  if (!str.startsWith('data:')) {
    throw new Error('Image invalide (data URL attendue)');
  }
  const comma = str.indexOf(',');
  if (comma === -1) throw new Error('Image invalide (data URL attendue)');

  const header = str.slice(5, comma); // after "data:"
  const payload = str.slice(comma + 1);
  let mime = (header.split(';')[0] || '').trim().toLowerCase();

  // Normalize rare / empty mime from some SVG uploads
  if (!mime || mime === 'application/octet-stream') {
    if (payload.includes('%3Csvg') || payload.includes('PHN2Zy')) {
      mime = 'image/svg+xml';
    }
  }
  if (mime === 'image/jpg') mime = 'image/jpeg';

  if (!isAcceptedImageType(mime)) {
    throw new Error(`Format non supporté: ${mime || 'inconnu'}. Utilisez JPG, PNG, WebP, GIF ou SVG.`);
  }

  const isBase64 = /;base64/i.test(header);
  let bytes;
  if (isBase64) {
    const binary = atob(payload);
    bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  } else {
    const decoded = decodeURIComponent(payload);
    bytes = new TextEncoder().encode(decoded);
  }
  return { blob: new Blob([bytes], { type: mime }), mime };
}

/** Prefer Storage public URL, fall back to legacy base64 column. */
export function resolveImageSrc(row) {
  if (!row) return null;
  return row.image_url || row.image || null;
}

export function itemImagePath(domainId, itemId, mime) {
  return `items/${domainId}/${itemId}.${extFromMime(mime)}`;
}

export function categoryImagePath(domainId, categoryId, mime) {
  return `categories/${domainId}/${categoryId}.${extFromMime(mime)}`;
}
