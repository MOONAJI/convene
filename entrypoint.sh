#!/usr/bin/env bash
set -e

DAR=$(find .daml/dist -name "*.dar" | head -n 1)
PORT="${PORT:-7575}"

echo "Starting Canton Sandbox..."
daml sandbox --dar "$DAR" --port 6865 &
SANDBOX_PID=$!

echo "Waiting for sandbox to be ready..."
until daml ledger list-parties --host localhost --port 6865 >/dev/null 2>&1; do
  sleep 2
done

echo "Sandbox port is up, giving the participant a moment to connect to its domain..."
sleep 5

echo "Seeding parties + demo data (setupConvene)..."
MAX_RETRIES=10
RETRY=0
until daml script \
  --dar "$DAR" \
  --script-name Setup:setupConvene \
  --ledger-host localhost --ledger-port 6865; do
  RETRY=$((RETRY+1))
  if [ "$RETRY" -ge "$MAX_RETRIES" ]; then
    echo "setupConvene failed after $MAX_RETRIES retries, giving up."
    exit 1
  fi
  echo "setupConvene failed (domain likely not connected yet), retrying in 3s... ($RETRY/$MAX_RETRIES)"
  sleep 3
done

echo "Starting JSON API on port $PORT..."
exec daml json-api \
  --ledger-host localhost --ledger-port 6865 \
  --http-port "$PORT" \
  --address 0.0.0.0 \
  --allow-insecure-tokens