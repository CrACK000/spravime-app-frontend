# Stage 1 - the build process
FROM node:20 as build-deps

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2 - the production environment
FROM node:20

WORKDIR /app

# Copy build from Stage 1
COPY --from=build-deps /app/dist ./dist

# Nainštalujte http-server
RUN npm install -g http-server

# Spustite server na porte 8080 s podporou SPA
CMD http-server dist -p ${PORT:-8080} -P / -s