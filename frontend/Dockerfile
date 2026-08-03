FROM node:20

# curl is used by the compose healthcheck to probe the Vite dev server
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Give ownership to the 'node' user so the dev server can write to caches.
# The node image (Debian-based) already declares this user.
RUN chown -R node:node /app

USER node

EXPOSE 5173

CMD ["npm", "run", "dev"]
