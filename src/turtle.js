const {log, floor} = Math;
const {MAX_SAFE_INTEGER} = Number;
const MAX_INTEGER_BUFFER_LENGTH = floor(log(MAX_SAFE_INTEGER) / log(2) / 8);

/**
 * Encode buffer as xsd:hexBinary suitable for turtle document.
 * @param {Buffer} buffer
 * @returns {string}
 */
export function encodeHexBinary(buffer) {
  return `"${buffer.toString("hex")}"^^xsd:hexBinary`;
}

/**
 * Encode buffer as big-endian xsd:integer suitable for turtle document.
 * @param {Buffer} buffer
 * @returns {string}
 */
export function encodeInteger(buffer) {
  const {length} = buffer;

  if (length > MAX_INTEGER_BUFFER_LENGTH) {
    throw new Error("buffer too large for xsd:integer");
  }

  let num = 0;

  for (let i=0; i<length; i++) {
    num <<= 8;
    num += buffer[i];
  }

  return String(num);
}
