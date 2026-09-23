#!/bin/bash
# Local reflection of .github/workflows/ci.yml — same commands, same order.
set -e
cd "$(dirname "$0")/.."

npm run format:check
npm run lint
npm run lint:md
npm run check-locales
npm run test
# The URL rides the command: dev needs API_URL empty for the proxy to match, and the production
# build refuses to run without it — one .env.local cannot be both. The artifact is never deployed.
API_URL=https://api.showcase.mkdigital.sk npm run build
