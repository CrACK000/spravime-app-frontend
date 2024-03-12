# Stage 1 - the build process
FROM node:20 as build-deps
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV VITE_BACKEND=${VITE_BACKEND}
RUN npm run build

# Stage 2 - the production environment
FROM node:20
WORKDIR /app
# Copy build from Stage 1
COPY --from=build-deps /app/dist ./dist
# Install http server
RUN npm install -g http-server
# Run the server with defined or default port
CMD http-server dist -p ${PORT:-8080}