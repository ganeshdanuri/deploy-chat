#!/usr/bin/env bash
# Build with Cloud Build and deploy to Cloud Run.
#
#   ./deploy/deploy.sh
set -euo pipefail

cd "$(dirname "$0")/.."

SERVICE=deploy-chat-api
REGION=asia-southeast1

PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
RUNTIME_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

# Public OAuth client IDs -- not secrets, they ship in frontend bundles anyway
GOOGLE_CLIENT_ID=$(grep '^GOOGLE_CLIENT_ID=' .env | cut -d= -f2-)
GITHUB_CLIENT_ID=$(grep '^GITHUB_CLIENT_ID=' .env | cut -d= -f2-)

# Cloud Build runs as the compute SA and needs this to push images. Idempotent.
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${RUNTIME_SA}" \
  --role="roles/cloudbuild.builds.builder" \
  --condition=None >/dev/null 2>&1 || true

gcloud run deploy "$SERVICE" \
  --source . \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 8080 \
  --cpu 1 \
  --memory 1Gi \
  --concurrency 40 \
  --timeout 300 \
  --min-instances 0 \
  --max-instances 5 \
  --set-env-vars "GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID},GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}" \
  --set-secrets "DATABASE_URL=DATABASE_URL:latest,SECRET_KEY=SECRET_KEY:latest,RESEND_API_KEY=RESEND_API_KEY:latest,GITHUB_CLIENT_SECRET=GITHUB_CLIENT_SECRET:latest"

echo
gcloud run services describe "$SERVICE" --region "$REGION" --format='value(status.url)'
