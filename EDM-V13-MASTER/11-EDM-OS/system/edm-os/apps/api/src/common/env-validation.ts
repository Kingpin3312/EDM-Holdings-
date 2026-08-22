// Configuration validation run at boot. In production it refuses to start on a
// missing or insecure config — most importantly the default JWT secret, which
// would let anyone forge a login. Returns a list of human-readable errors.

export function validateEnv(env: NodeJS.ProcessEnv, opts: { production: boolean }): string[] {
  const errors: string[] = [];
  if (!opts.production) return errors;

  if (!env.DATABASE_URL) errors.push("DATABASE_URL is required");

  if (!env.SUPABASE_JWT_SECRET) errors.push("SUPABASE_JWT_SECRET is required");
  else if (env.SUPABASE_JWT_SECRET === "dev-secret") errors.push("SUPABASE_JWT_SECRET is still the insecure default 'dev-secret' — set a real secret");

  if (!env.TOKEN_ENCRYPTION_KEY) errors.push("TOKEN_ENCRYPTION_KEY is required (32 bytes, 64 hex chars or base64)");
  else {
    const k = env.TOKEN_ENCRYPTION_KEY;
    const buf = k.length === 64 ? Buffer.from(k, "hex") : Buffer.from(k, "base64");
    if (buf.length !== 32) errors.push("TOKEN_ENCRYPTION_KEY must decode to 32 bytes");
  }

  if (!env.CORS_ORIGIN) errors.push("CORS_ORIGIN must be set to your web origin in production (not a wildcard)");

  return errors;
}
