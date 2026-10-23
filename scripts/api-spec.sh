#!/usr/bin/env bash
# Prints the spec `types:api` reads — the one `API_SPEC` names, as CI's own checkout of kmp-showcase does, else
# kmp-showcase's working tree beside this repo's main checkout. A ticket's worktree reads kmp-showcase's worktree of
# its own name where one stands, so a contract change is checked against its branch.
set -euo pipefail

if [[ -n ${API_SPEC:-} ]]; then
  echo "$API_SPEC"
  exit
fi

cd "$(dirname "$0")/.."
here="$(pwd -P)"
main="$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")"
api="$(dirname "$main")/kmp-showcase"
own="$api/.claude/worktrees/$(basename "$here")"
if [[ $here != "$main" && -d $own ]]; then api="$own"; fi

spec="$api/contracts/openapi.json"
if [[ ! -f $spec ]]; then
  echo "api-spec.sh: no ${spec} — check kmp-showcase out beside this repo, or name the spec: API_SPEC=<path>" >&2
  exit 1
fi
echo "$spec"
