#!/bin/bash
# Local reflection of .github/workflows/ci.yml — same commands, same order.
set -e
cd "$(dirname "$0")/.."

npm run format:check
npm run types:check
npm run lint
npm run lint:md
npm run lint:sh
npm run check-locales
npm run test
npm run build

# Green — record the tree proved, the index with the tracked edits beside it, for the push check in studio-seed's
# commit hook (rules/pre-commit-review.md § Push). A tree the list does not hold is one no gate ran on. A scratch index
# takes the edits, for `git stash create` refuses a file added as intent alone, as `seed pool land` adds a new one.
INDEX="$(mktemp)"
cp "$(git rev-parse --git-path index)" "$INDEX"
GIT_INDEX_FILE="$INDEX" git add -u
GIT_INDEX_FILE="$INDEX" git write-tree >> "$(git rev-parse --git-common-dir)/ci-green"
rm "$INDEX"
