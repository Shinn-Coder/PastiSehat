FROM node:lts

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate

EXPOSE 8000

CMD ["sh", "-c", "npx prisma db push && npm run dev"]
