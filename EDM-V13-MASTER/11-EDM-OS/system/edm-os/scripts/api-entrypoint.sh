#!/bin/sh
# Bring the API up against a fresh database: wait for Postgres, sync the schema
# (db push — no migration history needed for first run), seed idempotently,
# then start the API with hot reload.
set -e

DB_HOST="${DB_HOST:-db}"
echo "[entrypoint] waiting for Postgres at ${DB_HOST}:5432 ..."
until node -e "require('net').connect({host:process.env.DB_HOST||'db',port:5432}).on('connect',function(){process.exit(0)}).on('error',function(){process.exit(1)})" 2>/dev/null; do
  sleep 1
done
echo "[entrypoint] Postgres is up."

echo "[entrypoint] syncing schema (prisma db push) ..."
npm --workspace packages/db run push

echo "[entrypoint] seeding demo data (idempotent) ..."
npm --workspace packages/db run seed || echo "[entrypoint] seed skipped/failed (continuing)"

echo "[entrypoint] starting API on :${API_PORT:-4000} ..."
exec npm --workspace apps/api run start:dev
