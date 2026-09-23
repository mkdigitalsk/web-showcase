#!/bin/bash
# Local reflection of .github/workflows/ci.yml — same commands, same order.
set -e
cd "$(dirname "$0")/.."

npm run format:check
npm run lint
npm run lint:md
npm run check-locales
npm run test
API_URL=https://api.showcase.mkdigital.sk npm run build
