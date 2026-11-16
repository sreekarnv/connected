FROM node:24-bookworm-slim@sha256:dc26ae92c9fb15cf6b1d63e20f0944b2efe0f115b20e00be48fb23fceb061c54 AS build

WORKDIR /app

RUN npm install --global pnpm@12.18.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile --prod
COPY src ./src
COPY tsconfig.json ./

FROM node:24-bookworm-slim@sha256:dc26ae92c9fb15cf6b1d63e20f0944b2efe0f115b20e00be48fb23fceb061c54 AS runtime

WORKDIR /app

ENV NODE_ENV=production ENVIRONMENT=production PORT=4002
COPY --from=build --chown=node:node /app ./

USER node

EXPOSE 4002

CMD ["node", "--import=tsx", "src/server.ts"]
