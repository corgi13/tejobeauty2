#!/usr/bin/env bash
set -euo pipefail

# Optional envs for cloning:
# WEB_REPO, API_REPO, WORKER_REPO, INFRA_REPO (Git URLs)
# Required envs:
# DOMAIN=tejo-beauty.com
# EMAIL for certbot

if [[ -z "${DOMAIN:-}" || -z "${EMAIL:-}" ]]; then
  echo "Please export DOMAIN and EMAIL" >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y build-essential git curl ufw nginx certbot python3-certbot-nginx redis-server postgresql postgresql-contrib

# Node LTS
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
  apt-get install -y nodejs
fi

# Meilisearch
if ! command -v meilisearch >/dev/null 2>&1; then
  curl -L https://install.meilisearch.com | sh
  mv meilisearch /usr/local/bin
fi

mkdir -p /opt/tejo-web /opt/tejo-api /opt/tejo-worker /opt/tejo-infra

# Clone or pull if URLs provided
if [[ -n "${WEB_REPO:-}" ]]; then if [[ -d /opt/tejo-web/.git ]]; then (cd /opt/tejo-web && git pull); else git clone "$WEB_REPO" /opt/tejo-web; fi; fi
if [[ -n "${API_REPO:-}" ]]; then if [[ -d /opt/tejo-api/.git ]]; then (cd /opt/tejo-api && git pull); else git clone "$API_REPO" /opt/tejo-api; fi; fi
if [[ -n "${WORKER_REPO:-}" ]]; then if [[ -d /opt/tejo-worker/.git ]]; then (cd /opt/tejo-worker && git pull); else git clone "$WORKER_REPO" /opt/tejo-worker; fi; fi
if [[ -n "${INFRA_REPO:-}" ]]; then if [[ -d /opt/tejo-infra/.git ]]; then (cd /opt/tejo-infra && git pull); else git clone "$INFRA_REPO" /opt/tejo-infra; fi; fi

# Database
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname = 'tejo'" | grep -q 1 || sudo -u postgres psql -c "CREATE USER tejo WITH PASSWORD 'changeme';"
sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw tejo || sudo -u postgres psql -c "CREATE DATABASE tejo OWNER tejo;"

# Env placeholders if not present
[[ -f /opt/tejo-api/.env ]] || cp /opt/tejo-api/.env.example /opt/tejo-api/.env || true
[[ -f /opt/tejo-web/.env ]] || cp /opt/tejo-web/.env.example /opt/tejo-web/.env || true
[[ -f /opt/tejo-worker/.env ]] || cp /opt/tejo-worker/.env.example /opt/tejo-worker/.env || true

# Apply domain to web env
sed -i "s#NEXT_PUBLIC_SITE_URL=.*#NEXT_PUBLIC_SITE_URL=https://${DOMAIN}#" /opt/tejo-web/.env || true
sed -i "s#NEXT_PUBLIC_API_URL=.*#NEXT_PUBLIC_API_URL=https://${DOMAIN}/api#" /opt/tejo-web/.env || true

# Apply API env defaults
sed -i "s#^DATABASE_URL=.*#DATABASE_URL=postgresql://tejo:changeme@localhost:5432/tejo#" /opt/tejo-api/.env || true
sed -i "s#^REDIS_URL=.*#REDIS_URL=redis://127.0.0.1:6379#" /opt/tejo-api/.env || true
sed -i "s#^MEILI_URL=.*#MEILI_URL=http://127.0.0.1:7700#" /opt/tejo-api/.env || true
sed -i "s#^MEILI_MASTER_KEY=.*#MEILI_MASTER_KEY=changeme#" /opt/tejo-api/.env || true
sed -i "s#^FRONTEND_ORIGIN=.*#FRONTEND_ORIGIN=https://${DOMAIN}#" /opt/tejo-api/.env || true
sed -i "s#^REVALIDATE_SECRET=.*#REVALIDATE_SECRET=changeme#" /opt/tejo-api/.env || true
sed -i "s#^PAYMENT_PROVIDER=.*#PAYMENT_PROVIDER=stripe#" /opt/tejo-api/.env || true

# Build apps (if folders exist)
if [[ -d /opt/tejo-api ]]; then (cd /opt/tejo-api && npm ci && npx prisma migrate deploy && npm run build && npm run prisma:seed); fi
if [[ -d /opt/tejo-web ]]; then (cd /opt/tejo-web && npm ci && npm run build); fi
if [[ -d /opt/tejo-worker ]]; then (cd /opt/tejo-worker && npm ci && npm run build); fi

# systemd units
cp /opt/tejo-infra/systemd/tejo-backend.service /etc/systemd/system/
cp /opt/tejo-infra/systemd/tejo-frontend.service /etc/systemd/system/
cp /opt/tejo-infra/systemd/tejo-worker.service /etc/systemd/system/
cp /opt/tejo-infra/systemd/tejo-meilisearch.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now tejo-backend tejo-worker tejo-meilisearch || true

# nginx
cp /opt/tejo-infra/nginx/tejo.conf /etc/nginx/sites-available/tejo.conf
sed -i "s#server_name .*#server_name ${DOMAIN} www.${DOMAIN};#" /etc/nginx/sites-available/tejo.conf
ln -sf /etc/nginx/sites-available/tejo.conf /etc/nginx/sites-enabled/tejo.conf
rm -f /etc/nginx/sites-enabled/default || true
nginx -t && systemctl reload nginx

# certbot
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" || true

# Start frontend (after TLS)
systemctl restart tejo-frontend || true

# Firewall
ufw allow OpenSSH || true
ufw allow http || true
ufw allow https || true
yes | ufw enable || true

# Reindex search
/opt/tejo-infra/scripts/reindex.sh || true

echo "Bootstrap completed. Visit https://${DOMAIN}"
