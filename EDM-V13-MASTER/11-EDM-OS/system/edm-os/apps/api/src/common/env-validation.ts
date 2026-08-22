// Configuration validation run at boot. It refuses to start on a missing or
// insecure config — most importantly the token signing key, which would let
// anyone forge a login. Returns a list of human-readable errors.
//
// These checks used to run only when NODE_ENV === "production". Every container
// in this repository sets NODE_ENV=development, so in practice they never ran.
// They now run ALWAYS, and a developer opts out explicitly with EDM_DEV=1 —
// which is a visible choice in a local shell rather than a silent default in a
// deployment.

export function validateEnv(env: NodeJS.ProcessEnv, opts: { production: boolean }): string[] {
  const errors: string[] = [];
  const relaxed = !opts.production && env.EDM_DEV === "1";

  if (!env.DATABASE_URL) errors.push("DATABASE_URL is required");

  if (!env.SUPABASE_JWT_SECRET) {
    errors.push("SUPABASE_JWT_SECRET is required");
  } else if (env.SUPABASE_JWT_SECRET === "dev-secret") {
    if (!relaxed) {
      errors.push(
        "SUPABASE_JWT_SECRET is still the insecure default 'dev-secret' — set a real secret " +
          "(or set EDM_DEV=1 to allow it for local development only)",
      );
    }
  } else if (env.SUPABASE_JWT_SECRET.length < 32) {
    errors.push("SUPABASE_JWT_SECRET is shorter than 32 characters — use a full-length secret");
  }

  if (!env.TOKEN_ENCRYPTION_KEY) {
    // Only required once an integration that stores OAuth tokens is connected.
    if (opts.production) errors.push("TOKEN_ENCRYPTION_KEY is required (32 bytes, 64 hex chars or base64)");
  } else {
    const k = env.TOKEN_ENCRYPTION_KEY;
    const buf = k.length === 64 ? Buffer.from(k, "hex") : Buffer.from(k, "base64");
    if (buf.length !== 32) errors.push("TOKEN_ENCRYPTION_KEY must decode to 32 bytes");
  }

  if (!env.CORS_ORIGIN) {
    if (!relaxed) {
      errors.push(
        "CORS_ORIGIN must be set to your web origin (e.g. https://os.edmholdings.ae). " +
          "Without it the API would accept credentialed requests from any site.",
      );
    }
  } else if (env.CORS_ORIGIN.split(",").some((o) => o.trim() === "*")) {
    errors.push("CORS_ORIGIN must name real origins — '*' cannot be used with credentials");
  }

  return errors;
}
