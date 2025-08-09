#!/usr/bin/env bash
set -euo pipefail
API=${API_BASE_URL:-"http://127.0.0.1:4000"}
curl -X POST "$API/reindex" -H 'Content-Type: application/json' -d '{"types":["products","blog"]}'
echo "Reindex triggered"

