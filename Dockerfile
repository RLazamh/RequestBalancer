# Primera etapa: Construcción de la aplicación
FROM node:20.9.0-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY tsconfig*.json ./
COPY src ./src
COPY main.ts ./

RUN npm run build

FROM node:20.9.0-alpine AS production

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

ENV NODE_ENV=production

EXPOSE 4000

CMD ["node", "dist/main"]
