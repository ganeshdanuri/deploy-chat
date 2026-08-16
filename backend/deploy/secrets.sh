#!/usr/bin/env bash
# Push credentials from backend/.env into Google Secret Manager and grant
# the Cloud Run runtime service account permission to read them.
#
# Idempotent: re-run after rotating a key and it adds a new secret version.
#
#   ./deploy/secrets.sh                 # all of them
#   ./deploy/secrets.sh SECRET_KEY      # just the ones named
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ $# -gt 0 ]]; then
  SECRETS=("$@")
else
  SECRETS=(DATABASE_URL SECRET_KEY RESEND_API_KEY GITHUB_CLIENT_SECRET)
fi

PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
RUNTIME_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

echo "project: $PROJECT_ID"
echo "runtime service account: $RUNTIME_SA"
echo

for KEY in "${SECRETS[@]}"; do
  # cut -d= -f2- keeps '=' characters inside the value (connection strings have them)
  VALUE=$(grep "^${KEY}=" .env | cut -d= -f2-)
  if [[ -z "$VALUE" ]]; then
    echo "!! $KEY missing from .env, skipping"
    continue
  fi

  if gcloud secrets describe "$KEY" >/dev/null 2>&1; then
    # printf, not echo: a trailing newline becomes part of the secret value
    printf '%s' "$VALUE" | gcloud secrets versions add "$KEY" --data-file=- >/dev/null
    echo "   $KEY: new version added"
  else
    printf '%s' "$VALUE" | gcloud secrets create "$KEY" \
      --data-file=- --replication-policy=automatic >/dev/null
    echo "   $KEY: created"
  fi

  gcloud secrets add-iam-policy-binding "$KEY" \
    --member="serviceAccount:${RUNTIME_SA}" \
    --role="roles/secretmanager.secretAccessor" >/dev/null
done

echo
echo "done"
