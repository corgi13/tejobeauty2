# Tejo-Beauty Production Deployment (Hetzner Ubuntu 22.04)

1) Prepare server (root)
- apt update && apt install -y build-essential git curl ufw nginx certbot python3-certbot-nginx redis-server postgresql postgresql-contrib
- Node LTS: curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && apt install -y nodejs
- Meilisearch: curl -L https://install.meilisearch.com | sh && mv meilisearch /usr/local/bin

2) Create directories
- mkdir -p /opt/tejo-web /opt/tejo-api /opt/tejo-worker /opt/tejo-infra

3) Clone repos (or use deploy scripts with REPO_URL)
- cd /opt && git clone <web_repo_url> tejo-web && git clone <api_repo_url> tejo-api && git clone <worker_repo_url> tejo-worker && git clone <infra_repo_url> tejo-infra

4) Environment
- Create /opt/tejo-web/.env from .env.example, set NEXT_PUBLIC_* and REVALIDATE_SECRET
- Create /opt/tejo-api/.env from .env.example, set DB/Cloudinary/Stripe/Meili/Redis/Secrets
- Create /opt/tejo-worker/.env from .env.example

5) Database
- sudo -u postgres psql -c "CREATE USER tejo WITH PASSWORD '***';"
- sudo -u postgres psql -c "CREATE DATABASE tejo OWNER tejo;"
- In tejo-api: npm ci && npx prisma migrate deploy && npm run build && npm run prisma:seed

6) Meilisearch
- copy systemd unit tejo-meilisearch.service to /etc/systemd/system
- systemctl daemon-reload && systemctl enable --now tejo-meilisearch

7) App builds
- tejo-web: npm ci && npm run build
- tejo-api: npm ci && npx prisma migrate deploy && npm run build
- tejo-worker: npm ci && npm run build

8) systemd
- Copy tejo-frontend.service, tejo-backend.service, tejo-worker.service to /etc/systemd/system
- systemctl daemon-reload
- systemctl enable --now tejo-frontend tejo-backend tejo-worker

9) nginx + TLS
- Copy nginx/tejo.conf to /etc/nginx/sites-available/tejo.conf
- ln -s /etc/nginx/sites-available/tejo.conf /etc/nginx/sites-enabled/tejo.conf
- nginx -t && systemctl reload nginx
- certbot --nginx -d tejo-beauty.com -d www.tejo-beauty.com

10) Backups
- Use scripts/backup.sh and scripts/restore.sh for Postgres

11) Reindex (after seed)
- Run scripts/reindex.sh to populate Meili indices via worker

12) Deploy scripts
- scripts/deploy_web.sh, deploy_api.sh, deploy_worker.sh support REPO_URL env to clone/pull, install, build and restart services.
