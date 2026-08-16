# Deploying the Backend to Google Cloud Run

Everything needed to take `deploy-chat/backend` from a laptop to production, plus
the reasoning behind each choice and the failures we hit getting there.

---

## 1. What we're building

| Piece | Choice | Why |
|---|---|---|
| Compute | Cloud Run, `asia-southeast1` (Singapore) | Scales to zero, per-request billing, no servers to patch |
| Database | Neon Postgres, `aws-ap-southeast-1` | Serverless, free tier, pgvector support, co-located with compute |
| Image build | Cloud Build via `--source .` | Produces `linux/amd64` — an Apple Silicon Mac cannot |
| Image storage | Artifact Registry (auto-created) | Cloud Run pulls from here |
| Credentials | Secret Manager | IAM-gated and versioned, unlike plain env vars |
| Custom domain | Cloud Run domain mapping | Free, and `asia-southeast1` is one of the supported regions |

### Why Singapore and not Mumbai

Traffic is roughly 50/50 India and USA. Mumbai looked obvious, then two facts
killed it:

- **Cloud Run domain mappings are not available in `asia-south1`.** Only
  `asia-east1`, `asia-northeast1`, `asia-southeast1`, and some EU/US regions.
  Mumbai would have required a Global Load Balancer at roughly $20/month.
- **Neon has no Mumbai region.** Closest is Singapore. Cloud Run in Mumbai plus a
  database in Singapore means every query crosses a border — worse than putting
  both in Singapore.

Singapore costs India ~20ms versus Mumbai, is better positioned for trans-Pacific
routing to the US, keeps compute and database co-located, and supports domain
mappings natively. On an LLM-backed API where the model call takes 1–3 seconds,
20ms is not a number anyone will feel.

### Current identifiers

```
Project ID       deploy-chat-505706
Project number   144376675510
Region           asia-southeast1
Service          deploy-chat-api
Service URL      https://deploy-chat-api-144376675510.asia-southeast1.run.app
Target domain    api.deploychat.in   (not yet mapped)
```

---

## 2. One-time setup

### 2.1 Install and authenticate gcloud

```bash
brew install --cask google-cloud-sdk
# restart your shell
gcloud version
```

```bash
gcloud auth login
gcloud config set project deploy-chat-505706
gcloud config set run/region asia-southeast1
```

Verify billing is attached — nothing deploys without it:

```bash
gcloud beta billing projects describe deploy-chat-505706
```

Want `billingEnabled: true`.

> **Switching Google accounts.** `gcloud auth login` *adds* credentials rather
> than replacing them. To wipe the slate:
> ```bash
> gcloud auth revoke --all
> gcloud auth application-default revoke   # separate credential store
> ```
> The second one matters. Application-default credentials are what SDKs pick up
> silently, and a stale one authenticates you as the wrong identity without ever
> saying so.

### 2.2 Enable the APIs

```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com
```

- **Cloud Run** runs the container
- **Cloud Build** turns source into an image, so you never `docker push` from your laptop
- **Artifact Registry** stores that image
- **Secret Manager** holds credentials

### 2.3 Provision the database

1. Create a Neon project at <https://neon.tech>
   - Postgres **17**
   - Region **AWS Asia Pacific (Singapore)** — `aws-ap-southeast-1`
2. In the Neon SQL Editor:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   CREATE EXTENSION IF NOT EXISTS pgcrypto;
   ```
   (`deploy/../app/core/bootstrap.py` also does this, so this step is belt-and-braces.)
3. Copy the **pooled** connection string — the hostname contains `-pooler`.

**Use the pooled endpoint, not the direct one.** Cloud Run creates and destroys
instances constantly, and each one opening its own Postgres connection will
exhaust the connection limit under real traffic. The pooler is the receptionist
for a building with one phone line.

### 2.4 Fill in `.env`

Copy `.env.example` to `.env` and set real values.

```bash
cp .env.example .env
```

Generate a proper signing key:

```bash
python3 -c 'import secrets; print(secrets.token_hex(32))'
```

**Do not quote values in `.env`.** Docker's `--env-file` is not a shell — it does
not strip quotes, so `DATABASE_URL="postgres://..."` becomes a connection string
that literally begins with a `"` and fails to parse.

### 2.5 Push credentials to Secret Manager

```bash
./deploy/secrets.sh
```

Creates or versions `DATABASE_URL`, `SECRET_KEY`, `RESEND_API_KEY`, and
`GITHUB_CLIENT_SECRET`, then grants the Cloud Run runtime service account
`roles/secretmanager.secretAccessor` on each.

`GOOGLE_CLIENT_ID` and `GITHUB_CLIENT_ID` are deliberately *not* secrets — OAuth
client IDs ship inside frontend bundles and are public by design. They're passed
as plain env vars by the deploy script.

To rotate one key without churning versions of the others:

```bash
./deploy/secrets.sh SECRET_KEY
```

---

## 3. The container

[`Dockerfile`](Dockerfile) is two stages: a builder that resolves dependencies
with `uv` into a venv, and a slim runtime that carries only that venv plus `src`.

Three things in it are load-bearing:

**Dependency files are copied before source.** Docker caches layers top-down, so
`uv sync` only re-runs when `pyproject.toml` or `uv.lock` change — not on every
code edit. The first build is slow (`markitdown[all]` pulls onnxruntime and
pandas); later ones are seconds.

**`CMD` uses shell form so `${PORT}` expands.** Cloud Run injects `PORT=8080` and
health-checks exactly that port. A container listening on 8000 is killed as
unhealthy. This is why the `prod` script in `pyproject.toml` — which hardcodes
`--port 8000 --workers 4` — is not used in production.

**One uvicorn worker, not four.** Four processes inside a 1-vCPU container fight
each other while Cloud Run's own autoscaler sits idle. Scale out with instances,
not processes. One dial, not two.

### Testing it locally

```bash
docker build -t deploy-chat-api .
docker run --rm -p 8081:8080 --env-file .env deploy-chat-api
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8081/docs
```

Host port 8081 because Apache occupies 8080 on the dev machine. The container
still listens on 8080 internally; only the host side moves.

The image builds `arm64` on Apple Silicon. That's fine for local testing —
production images are built by Cloud Build as `amd64`. Never push the local one.

---

## 4. Schema management

Schema setup is a **deployment step, not a runtime step**.
[`src/app/core/bootstrap.py`](src/app/core/bootstrap.py) does it, in this order:

1. `CREATE EXTENSION IF NOT EXISTS pgcrypto, vector`
2. `SQLModel.metadata.create_all()`
3. `run_migrations()` — applies `src/app/migrations/*.sql` in filename order,
   tracked in the `schema_migrations` table

Run it against the current `DATABASE_URL`:

```bash
docker run --rm --env-file .env deploy-chat-api python -m app.core.bootstrap
```

Expect `Extension ready: ...` lines, migration lines, then `Bootstrap complete`.
It exits non-zero on failure, so CI can gate on it.

**Why this is not in the app's startup hook.** Cloud Run runs N instances. If DDL
lives in `@app.on_event("startup")`, then five instances cold-starting together
means five processes issuing `CREATE TABLE` at once — everybody reaching for the
same doorknob. It works on your laptop because there is only ever one of you.

**Why extensions must come before `create_all()`.** `DocumentChunk` declares a
`Vector(768)` column, which needs pgvector to already exist. A migration file
cannot fix this, because migrations run *after* `create_all()`.

**The trade-off, stated honestly:** you must remember to run bootstrap when you
add a migration. That's an explicit step you can forget, versus an implicit one
that corrupts under concurrency. Take the forgettable one.

---

## 5. Deploying

```bash
./deploy/deploy.sh
```

The script grants Cloud Build permission to push images (idempotent), then runs
`gcloud run deploy --source .` and prints the service URL.

### The flags and why they're set that way

| Flag | Value | Reasoning |
|---|---|---|
| `--max-instances` | `5` | Default is 100. A retry loop against a high ceiling is how people wake up to a four-figure bill. Set it to what you'd willingly pay, then raise it deliberately. |
| `--min-instances` | `0` | Free when idle. Cost: the first request after a quiet period pays a 10–20s cold start (onnxruntime is heavy). If that hurts, `1` keeps one warm for ~$5–8/month. |
| `--concurrency` | `40` | Default 80. LLM calls are I/O-bound and multiplex well; document parsing and embedding are CPU-bound and starve each other. 40 is a hedge — tune against real traffic. |
| `--memory` | `1Gi` | `markitdown[all]` plus pgvector operations. 512Mi is tight. |
| `--timeout` | `300` | Document ingestion is slow. Cloud Run's max is 3600. |
| `--allow-unauthenticated` | — | It's a public API. Note this makes `slowapi` rate limiting load-bearing rather than decorative. |
| `--set-secrets` | 4 keys | Values never appear in deploy config, logs, or `services describe` output. |

### Verifying

```bash
URL=$(gcloud run services describe deploy-chat-api --region asia-southeast1 --format='value(status.url)')
curl -s -o /dev/null -w "status=%{http_code} ttfb=%{time_starttransfer}s\n" "$URL/docs"
```

### Rolling back

Cloud Run keeps every revision. To send all traffic back to a previous one:

```bash
gcloud run revisions list --service deploy-chat-api --region asia-southeast1
gcloud run services update-traffic deploy-chat-api \
  --region asia-southeast1 \
  --to-revisions REVISION_NAME=100
```

This is instant and does not rebuild anything. Note it rolls back *code*, not
schema — migrations are forward-only.

### Logs

```bash
gcloud run services logs tail deploy-chat-api --region asia-southeast1
```

---

## 6. Custom domain — `api.deploychat.in`

**Status: not done yet.**

The domain is registered at GoDaddy. Current state of the zone:

- Nameservers: GoDaddy (`ns65/ns66.domaincontrol.com`)
- Root `A` → `216.198.79.1` (Vercel — the frontend)
- `api` `A` → `35.154.159.118` (AWS Mumbai — a previous deployment, to be replaced)
- No MX records, so DNS changes cannot break email

### 6.1 Verify domain ownership

```bash
gcloud domains verify deploychat.in
```

Opens Google Search Console, which issues a TXT record. Add it in GoDaddy under
**My Products → DNS → Manage DNS**:

| Type | Name | Value |
|---|---|---|
| TXT | `@` | `google-site-verification=...` |

Then click **Verify** in Search Console. Check propagation:

```bash
dig +short TXT deploychat.in @8.8.8.8
```

### 6.2 Create the mapping

```bash
gcloud beta run domain-mappings create \
  --service deploy-chat-api \
  --domain api.deploychat.in \
  --region asia-southeast1
```

It prints the DNS record to create.

### 6.3 Point GoDaddy at it

**Delete** the existing `api` A record (`35.154.159.118`), then add:

| Type | Name | Value |
|---|---|---|
| CNAME | `api` | `ghs.googlehosted.com` |

### 6.4 Wait for the certificate

Google provisions TLS automatically — anywhere from 15 minutes to 24 hours.

```bash
gcloud beta run domain-mappings describe \
  --domain api.deploychat.in --region asia-southeast1
curl -sI https://api.deploychat.in/docs | head -1
```

### Known limitations of domain mappings

- Still a **Preview** feature; Google notes latency caveats
- Google-managed certificates only — no custom certs
- No wildcards
- TLS 1.0/1.1 cannot be disabled
- Maps to `/` only, not to specific URL paths

### If you outgrow it

Two upgrade paths, both DNS changes rather than rebuilds:

- **Cloudflare** (free) — move nameservers off GoDaddy, `CNAME api` → the
  `run.app` hostname, proxied. Requires an Origin Rule overriding the Host header
  to the `run.app` name, or Cloud Run returns 404. Buys edge TLS termination on
  both continents, CDN, and DDoS protection.
- **Google Global External Load Balancer** (~$20/month) — anycast IP, Cloud
  Armor, and the ability to put serverless NEGs in several regions behind one
  address. The right answer once multi-region is genuinely needed.

Note that multi-region compute in front of a single-region database mostly moves
the latency rather than removing it. You cannot cache your way out of the speed
of light.

---

## 7. Failures we hit, and what they meant

### `function gen_random_bytes(integer) does not exist`

`gen_random_bytes()` lives in the **pgcrypto** extension, not core Postgres. The
local database had it enabled by hand months earlier; Neon was the first genuinely
blank slate the code had ever met. Fixed by declaring both required extensions in
`bootstrap.py`.

The general lesson, in one traceback: *if it isn't in the repo, it doesn't exist.*
The same applied to pgvector, which only worked because it had been created
manually in the Neon console.

### `bind: address already in use` on port 8080

Apache (`httpd`) was already listening on 8080 on the dev machine. Diagnose with:

```bash
lsof -nP -iTCP:8080 -sTCP:LISTEN
```

Fixed by mapping a different host port: `-p 8081:8080`.

### Domain mapping unavailable in Mumbai

Discovered by reading the docs rather than assuming. Drove the whole
region decision — see §1.

---

## 8. Cost

| Item | Cost |
|---|---|
| Cloud Run | Free tier covers 2M requests/month; scales to zero when idle |
| Neon | Free tier |
| Artifact Registry | Pennies for a handful of image versions |
| Secret Manager | Free at this volume |
| Domain mapping | Free |
| **Effective** | **~$0/month at current scale** |

The first real costs will be `--min-instances 1` (~$5–8/month) if cold starts
become a problem, and Neon's paid tier when the database outgrows the free plan.
Compute will not be the expensive part.

---

## 9. Quick reference

```bash
# deploy
./deploy/deploy.sh

# after adding a migration
docker build -t deploy-chat-api .
docker run --rm --env-file .env deploy-chat-api python -m app.core.bootstrap
./deploy/deploy.sh

# rotate one credential
./deploy/secrets.sh SECRET_KEY
./deploy/deploy.sh          # new revision picks up :latest

# logs
gcloud run services logs tail deploy-chat-api --region asia-southeast1

# roll back
gcloud run services update-traffic deploy-chat-api \
  --region asia-southeast1 --to-revisions REVISION_NAME=100
```
