#!/usr/bin/env bash
set -euo pipefail

ports=(3000 4000 7700)
for p in "${ports[@]}"; do
  pid=$(lsof -ti tcp:"$p" || true)
  if [[ -n "$pid" ]]; then
    echo "Killing PID $pid on port $p"
    kill -9 $pid || true
  fi
done

# Stop pm2 if present
if command -v pm2 >/dev/null 2>&1; then
  pm2 kill || true
fi

# Disable default nginx site
rm -f /etc/nginx/sites-enabled/default || true
nginx -t && systemctl reload nginx || true

echo "Cleanup complete"
