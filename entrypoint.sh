#!/usr/bin/env bash
set -e

DAR=$(find .daml/dist -name "*.dar" | head -n 1)
export PORT="${PORT:-7575}"
export ALLOWED_ORIGIN="${ALLOWED_ORIGIN:-https://convene-eight.vercel.app}"
JSON_API_PORT=7576

# Batas heap per JVM (bisa di-override lewat Railway Variables)
SANDBOX_JVM_OPTS="${SANDBOX_JVM_OPTS:--Xms64m -Xmx300m -XX:+UseSerialGC}"
SCRIPT_JVM_OPTS="${SCRIPT_JVM_OPTS:--Xmx256m -XX:+UseSerialGC}"
JSONAPI_JVM_OPTS="${JSONAPI_JVM_OPTS:--Xms32m -Xmx200m -XX:+UseSerialGC}"

SANDBOX_PID=""; CADDY_PID=""; JSONAPI_PID=""
cleanup() { kill $SANDBOX_PID $CADDY_PID $JSONAPI_PID 2>/dev/null || true; }
trap 'cleanup; exit 0' TERM INT

echo "Starting Canton Sandbox..."
JAVA_TOOL_OPTIONS="$SANDBOX_JVM_OPTS" daml sandbox --dar "$DAR" --port 6865 &
SANDBOX_PID=$!

echo "Waiting for sandbox to be ready..."
until daml ledger list-parties --host localhost --port 6865 >/dev/null 2>&1; do sleep 2; done
echo "Sandbox port is up, giving the participant a moment to connect to its domain..."
sleep 5

echo "Seeding parties + demo data (setupConvene)..."
MAX_RETRIES=10; RETRY=0
until JAVA_TOOL_OPTIONS="$SCRIPT_JVM_OPTS" daml script --dar "$DAR" --script-name Setup:setupConvene --ledger-host localhost --ledger-port 6865; do
  RETRY=$((RETRY+1))
  if [ "$RETRY" -ge "$MAX_RETRIES" ]; then echo "setupConvene failed after $MAX_RETRIES retries, giving up."; exit 1; fi
  echo "setupConvene failed (domain likely not connected yet), retrying in 3s... ($RETRY/$MAX_RETRIES)"
  sleep 3
done

echo "Starting Caddy on port $PORT (CORS for $ALLOWED_ORIGIN) -> JSON API on 127.0.0.1:$JSON_API_PORT..."
caddy run --config /app/Caddyfile --adapter caddyfile &
CADDY_PID=$!

echo "Starting JSON API on 127.0.0.1:$JSON_API_PORT..."
JAVA_TOOL_OPTIONS="$JSONAPI_JVM_OPTS" daml json-api --ledger-host localhost --ledger-port 6865 \
  --http-port "$JSON_API_PORT" --address 127.0.0.1 --allow-insecure-tokens &
JSONAPI_PID=$!

# Watchdog: kalau salah satu proses inti mati, keluar supaya Railway restart container
wait -n $SANDBOX_PID $CADDY_PID $JSONAPI_PID || true
echo "FATAL: sandbox / caddy / json-api berhenti. Exit supaya Railway me-restart container."
cleanup
exit 1