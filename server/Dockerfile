FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# Pasta de logs de contingência gravável pelo usuário sem privilégios
RUN mkdir -p /app/logs && chown -R node:node /app/logs

# Segurança: a API não deve rodar como root dentro do container
USER node

EXPOSE 3333

CMD ["node", "dist/src/index.js"]
