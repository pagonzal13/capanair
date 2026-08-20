// Firma y verificacion de cookies de sesion sin dependencias externas,
// usando Web Crypto API (compatible con Node.js y con el Edge Runtime
// del middleware de Next.js).

function base64url(bytes: Uint8Array): string {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (padded.length % 4)) % 4;
  const b64 = padded + "=".repeat(padLength);
  const str = atob(b64);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret) as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function hmacSign(key: CryptoKey, data: Uint8Array): Promise<ArrayBuffer> {
  return crypto.subtle.sign("HMAC", key, data as BufferSource);
}

export async function createSessionToken(
  secret: string,
  payload: Record<string, unknown>,
  maxAgeSeconds: number
): Promise<string> {
  const body = { ...payload, exp: Math.floor(Date.now() / 1000) + maxAgeSeconds };
  const json = JSON.stringify(body);
  const jsonBytes = new TextEncoder().encode(json);
  const key = await getHmacKey(secret);
  const sigBuf = await hmacSign(key, jsonBytes);
  return `${base64url(jsonBytes)}.${base64url(new Uint8Array(sigBuf))}`;
}

export async function verifySessionToken(
  secret: string,
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  const [data, sig] = token.split(".");
  if (!data || !sig) return false;

  try {
    const jsonBytes = fromBase64url(data);
    const key = await getHmacKey(secret);
    const expectedSigBuf = await hmacSign(key, jsonBytes);
    const expectedSig = base64url(new Uint8Array(expectedSigBuf));
    if (expectedSig !== sig) return false;

    const payload = JSON.parse(new TextDecoder().decode(jsonBytes)) as { exp?: number };
    if (typeof payload.exp !== "number") return false;
    return payload.exp >= Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
