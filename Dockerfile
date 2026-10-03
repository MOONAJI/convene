FROM ubuntu:22.04

# JDK + curl buat install Daml assistant
RUN apt-get update && apt-get install -y curl openjdk-17-jdk-headless && rm -rf /var/lib/apt/lists/*

# Install Daml SDK — PIN ke 2.10.x sesuai CLAUDE.md, JANGAN upgrade
RUN curl -sSL https://get.daml.com/ | sh -s 2.10.6
ENV PATH="/root/.daml/bin:${PATH}"

WORKDIR /app
COPY daml.yaml ./
COPY daml ./daml

RUN daml build

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 7575
CMD ["./entrypoint.sh"]

# Caddy: reverse proxy kecil untuk header CORS (binary diambil dari image resmi)
COPY --from=caddy:2 /usr/bin/caddy /usr/bin/caddy
COPY Caddyfile ./