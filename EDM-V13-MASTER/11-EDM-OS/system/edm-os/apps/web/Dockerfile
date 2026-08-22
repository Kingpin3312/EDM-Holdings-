# EDM OS — Web (development container).
# Runs the Next.js app with hot reload. For a production build use
# `npm --workspace apps/web run build && ... run start` (see DEPLOYMENT.md).
FROM node:20-slim
WORKDIR /app

COPY . .
RUN npm install --no-audit --no-fund

ENV NODE_ENV=development
EXPOSE 3000
# Bind to 0.0.0.0 so the container port is reachable from the host.
CMD ["npm", "--workspace", "apps/web", "run", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]
