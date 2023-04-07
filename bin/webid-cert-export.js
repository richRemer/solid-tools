#!/usr/bin/env node

import {readFileSync} from "fs";
import {X509Certificate} from "crypto";
import {encodeInteger, encodeHexBinary} from "@welib/solid-tools/turtle";
import {subjectAltNames} from "@welib/solid-tools/x509";

try {
  const {cert} = getopts(process.argv);
  const type = "spki";    // RSA format could also use "pkcs1"
  const format = "jwk";   // friendly to JavaScript
  const {n: modulus, e: exponent} = cert.publicKey.export({type, format});
  const [exp, mod] = [exponent, modulus].map(v => Buffer.from(v, "base64"));
  const uris = subjectAltNames(cert, "URI").map(u => u.slice("URI:".length));

  console.log(turtle(uris, exp, mod));
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

function getopts(argv) {
  const args = argv.slice(2);
  const config = {};

  if (args[0] === "--help") {
    console.info("Usage: webid-cert-export <cert_file>");
  } else if (args) {
    config.cert = readFileSync(args[0]);
    config.cert = new X509Certificate(config.cert);

    if (config.cert.publicKey.asymmetricKeyType !== "rsa") {
      throw new Error("only RSA certificates supported");
    }

    return config;
  } else {
    throw new Error("missing required RSA certificate");
  }
}

function key(uri, exp, mod) {
  return `
<${uri}> cert:key [
  a cert:RSAPublicKey;
  cert:exponent ${encodeInteger(exp)};
  cert:modulus ${encodeHexBinary(mod)}].
  `.trim();
}

function turtle(uris, exp, mod) {
  return `
@prefix cert: <http://www.w3.org/ns/auth/cert#>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.

${uris.map(uri => key(uri, exp, mod)).join("\n\n")}
  `.trim();
}
