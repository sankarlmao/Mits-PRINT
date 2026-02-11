# =====================
# 1️⃣ Build Stage
# =====================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build


# =====================
# 2️⃣ Production Stage
# =====================
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy only what we need
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.* ./

EXPOSE 3000

CMD ["npm", "start"]