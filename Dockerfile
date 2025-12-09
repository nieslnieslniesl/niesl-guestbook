FROM node:20-alpine3.18 AS base
RUN apk add --no-cache python3 make g++ libc6-compat openssl1.1-compat
WORKDIR /app

FROM base AS deps
RUN apk add --no-cache python3 make g++ libc6-compat
COPY package.json package-lock.json* ./
RUN npm install --include=dev

FROM deps AS builder
COPY . .
RUN npm run prisma:generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=80
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/prisma ./prisma
RUN mkdir -p /app/uploads
EXPOSE 80
CMD ["npm", "run", "start"]

