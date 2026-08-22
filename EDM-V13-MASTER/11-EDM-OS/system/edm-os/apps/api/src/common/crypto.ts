import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

// Authenticated encryption (AES-256-GCM) for OAuth tokens at rest. The key comes
// from TOKEN_ENCRYPTION_KEY (32 bytes, as 64 hex chars or base64). Fails closed:
// no key, no encryption. Stored format: "v1.<iv>.<tag>.<ciphertext>" (all base64).

const ALGO = "aes-256-gcm";

function key(): Buffer {
  const raw = process.env.TOKEN_ENCRYPTION_KEY;
  if (!raw) throw new Error("TOKEN_ENCRYPTION_KEY is not set");
  const buf = raw.length === 64 ? Buffer.from(raw, "hex") : Buffer.from(raw, "base64");
  if (buf.length !== 32) throw new Error("TOKEN_ENCRYPTION_KEY must be 32 bytes (64 hex chars or base64)");
  return buf;
}

export function encryptToken(plain: string | null | undefined): string | null {
  if (plain == null) return null;
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1.${iv.toString("base64")}.${tag.toString("base64")}.${enc.toString("base64")}`;
}

export function decryptToken(stored: string | null | undefined): string | null {
  if (stored == null) return null;
  const parts = stored.split(".");
  if (parts.length !== 4 || parts[0] !== "v1") throw new Error("Malformed encrypted token");
  const [, ivB64, tagB64, dataB64] = parts;
  const decipher = createDecipheriv(ALGO, key(), Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(dataB64, "base64")), decipher.final()]).toString("utf8");
}
