# Builder Stage
FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

# Production Stage
FROM node:lts-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Copy generated Prisma Client and compiled code from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist

EXPOSE 8000

CMD ["node", "dist/index.js"]
