/**
 * Extract subject alternative names from X509 certificate, with optional
 * filter on which types of names to return (e.g. "DNS" or "URI").
 * @param {X509Certificate} cert
 * @param {string} [type]
 * @returns {string[]}
 */
export function subjectAltNames(cert, type=undefined) {
  const {subjectAltName} = cert;
  const names = subjectAltName.split(",").map(s => s.trim());
  return names.filter(n => type === undefined || n.startsWith(type + ":"));
}