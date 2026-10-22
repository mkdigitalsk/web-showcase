#!/bin/bash
# Boots the shared API — kmp-showcase's server — on a throwaway database, builds this app, runs its Playwright
# journey against the two, and tears the stack down.
#
# ⚠ It takes no API to point at, and that is the safety property — not an omission. The journey writes rows, so a
# switch aiming it at staging would leave them in a database other people use.
#
# Deliberately NOT part of run-ci-checks.sh: it needs Docker and a JDK, and runs on request.
#
# Usage:  bash scripts/run-e2e.sh [kmp-showcase checkout]   (defaults to ../kmp-showcase beside this repo)
#
# Ports: E2E_API_PORT · E2E_WEB_PORT · E2E_DB_PORT, else the pool place's .env.ports.local, else the defaults below.
# E2E_WATCH=1 runs the journey in a visible Chrome. The database is a Postgres container removed at the end, and
# its secrets die with it. Docker Desktop must be running.

set -uo pipefail

case "${1:-}" in
  -h | --help)
    echo 'usage: bash scripts/run-e2e.sh [kmp-showcase checkout]   (defaults to ../kmp-showcase beside this repo)'
    exit 0;;
esac

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
API="${1:-$REPO/../kmp-showcase}"
[ -x "$API/gradlew" ] || { echo "no kmp-showcase checkout at $API — pass its path" >&2; exit 2; }

# The pool place's ports, from the file `seed pool start` writes — a port the environment already sets is kept.
load_place_ports() {
  local file="$REPO/.env.ports.local" name value
  [ -f "$file" ] || return 0
  while IFS='=' read -r name value; do
    case "$name" in
      E2E_*_PORT) [ -n "${!name:-}" ] || export "$name=$value";;
    esac
  done < "$file"
}
load_place_ports

API_PORT="${E2E_API_PORT:-8080}"
export E2E_WEB_PORT="${E2E_WEB_PORT:-4173}"
# Off the default 5432, where a desk's own Postgres listens.
DB_PORT="${E2E_DB_PORT:-55432}"

E2E_RUN_ID="$(date -u +%Y%m%d%H%M%S)$(openssl rand -hex 2)"
export E2E_RUN_ID

DB_CONTAINER="e2e-web-$E2E_RUN_ID"
DB_USER="showcase"
DB_PASSWORD="$(openssl rand -hex 16)"
# 32 bytes of CSPRNG output, per run — the token signs nothing that outlives the stack.
JWT_SECRET="$(openssl rand -hex 32)"

SERVER_PID=""
# shellcheck disable=SC2317,SC2329  # the trap below is the call site, which ShellCheck cannot follow
cleanup() {
  [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null
  # Gradle launches the server in a JVM of its own, which outlives the wrapper and keeps the port.
  local holder
  holder="$(lsof -ti ":$API_PORT" 2>/dev/null)"
  # shellcheck disable=SC2086  # several processes can hold one port, so the split is the point
  [ -n "$holder" ] && kill $holder 2>/dev/null
  docker rm -f "$DB_CONTAINER" >/dev/null 2>&1
}
trap cleanup EXIT

echo "── starting Postgres on :$DB_PORT"
docker run --detach --rm --name "$DB_CONTAINER" --publish "127.0.0.1:$DB_PORT:5432" \
  --env POSTGRES_DB=showcase --env POSTGRES_USER="$DB_USER" --env POSTGRES_PASSWORD="$DB_PASSWORD" \
  postgres:16-alpine >/dev/null || {
  echo "Docker could not start Postgres — open Docker Desktop, or free :$DB_PORT with E2E_DB_PORT" >&2
  exit 1
}
# Over TCP: while the image initialises, the server answers only on its socket, then restarts.
for _ in $(seq 1 30); do
  docker exec "$DB_CONTAINER" pg_isready --quiet --host 127.0.0.1 --username "$DB_USER" --dbname showcase && break
  sleep 1
done

echo "── starting the API on :$API_PORT"
(cd "$API" && DATABASE_URL="jdbc:postgresql://localhost:$DB_PORT/showcase" DATABASE_USER="$DB_USER" \
  DATABASE_PASSWORD="$DB_PASSWORD" JWT_SECRET="$JWT_SECRET" PORT="$API_PORT" ./gradlew --quiet :server:run) &
SERVER_PID=$!

echo "── waiting for /health"
for _ in $(seq 1 90); do
  curl -fsS --max-time 5 "http://localhost:$API_PORT/health" >/dev/null 2>&1 && break
  sleep 2
done
curl -fsS --max-time 5 "http://localhost:$API_PORT/health" >/dev/null 2>&1 || {
  echo "the API never became healthy — run it by hand to see why" >&2
  exit 1
}

echo "── building the app"
(cd "$REPO" && npm run build) || exit 1

# ⚠ API_URL or the preview proxies to whatever .env.local names. A real environment variable outranks the .env
# files, so this wins.
echo "── run $E2E_RUN_ID against localhost:$API_PORT"
(cd "$REPO" && API_URL="http://localhost:$API_PORT" npx playwright test)
RESULT=$?

[ $RESULT -eq 0 ] && echo "journey passed — run $E2E_RUN_ID" || echo "journey failed — run $E2E_RUN_ID"
exit $RESULT
