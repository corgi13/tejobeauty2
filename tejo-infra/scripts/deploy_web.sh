#!/usr/bin/env bash
set -euo pipefail

APP_DIR=/opt/tejo-web
REPO_URL=${REPO_URL:-}

if [ -n "$REPO_URL" ]; then
  if [ ! -d "$APP_DIR/.git" ]; then
    rm -rf "$APP_DIR" && mkdir -p "$APP_DIR"
    git clone "$REPO_URL" "$APP_DIR"
  else
    cd "$APP_DIR" && git pull
  fi
fi

cd "$APP_DIR"
npm ci
npm run build
systemctl restart tejo-frontend
echo "Deployed tejo-web"

