#!/usr/bin/env bash
set -euo pipefail
FILE=$1
DB_URL=${DATABASE_URL:-postgresql://postgres:postgres@127.0.0.1:5432/tejo}
pg_restore --clean --if-exists -d "$DB_URL" "$FILE"
echo "Restore from $FILE done"

