# Definujte základný kontajnerový obraz na Node.js 20
FROM node:20

# Nastavte pracovný adresár v kontajnere
WORKDIR /app

# Kopírujte súbory package.json a package-lock.json (alebo yarn.lock) do rovnakého adresára
COPY package*.json ./

# Nainštalujte závislosti projektu
RUN npm install

# Kopírujte všetky ostatné súbory projektu do toho istého adresára
COPY . .

# Postavte aplikáciu
RUN npm run build

# Nainštalujte http server
RUN npm install -g http-server

# Spustite server na porte 8080
CMD http-server dist -p 8080