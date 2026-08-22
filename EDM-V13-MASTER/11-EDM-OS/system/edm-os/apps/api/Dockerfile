# EDM OS — API (development container).
# Runs the NestJS API with hot reload, against the compose Postgres.
# Production build guidance is in DEPLOYMENT.md (the API needs the workspace
# db package compiled to JS rather than run via ts-node).
FROM node:20-slim
WORKDIR /app

# OpenSSL is required by Prisma's query engine on Debian.
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Whole monorepo (node_modules/.next/dist are excluded via .dockerignore).
COPY . .

# Install workspaces and generate the Prisma client.
# (prisma generate fetches its engine from the network — runs on your machine.)
RUN npm install --no-audit --no-fund \
  && npm --workspace packages/db run generate

ENV NODE_ENV=development
EXPOSE 4000
CMD ["sh", "scripts/api-entrypoint.sh"]
