#!/usr/bin/env bash
set -euo pipefail
DEST=${1:-/var/backups}
DB_URL=${DATABASE_URL:-postgresql://postgres:postgres@127.0.0.1:5432/tejo}
mkdir -p "$DEST"
STAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -Fc "$DB_URL" > "$DEST/tejo_$STAMP.dump"
find "$DEST" -name 'tejo_*.dump' -mtime +14 -delete
echo "Backup done: $DEST/tejo_$STAMP.dump"

