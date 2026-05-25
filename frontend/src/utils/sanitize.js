/**
 * Strips HTML tags, script constructs, and suspicious sequences to prevent XSS.
 * @param {string} val Input string
 * @returns {string} Sanitized string
 */
export function sanitizeInput(val) {
  if (typeof val !== 'string') return val;
  return val
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/javascript:/gi, '') // remove javascript: URI scheme
    .trim();
}
