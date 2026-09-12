#!/bin/sh
# Deploy the Feynman app to Cloud Run.
#
# Why Cloud Run and not Vercel: the old proxy was a Vercel serverless function, whose
# request body is hard-capped at 4.5MB. Uploads travel to Gemini as base64 inside that
# body, so the real ceiling was ~3MB of original file. Cloud Run accepts 32MB.
#
# The Gemini key is read straight out of the CogniCard service in the same project, so it
# never has to be typed, pasted, or stored in a file here.
set -e
cd "$(dirname "$0")"

export CLOUDSDK_PYTHON=/opt/homebrew/bin/python3   # gcloud crashes on the system Python 3.9

./sync.sh

KEY=$(gcloud run services describe cognicard-academic --region=asia-southeast1 --format=json \
  | "$CLOUDSDK_PYTHON" -c "import json,sys;d=json.load(sys.stdin);print([e['value'] for e in d['spec']['template']['spec']['containers'][0]['env'] if e['name']=='GEMINI_API_KEY'][0])")

gcloud run deploy feynman-ai \
  --source . \
  --region=asia-southeast1 \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --update-env-vars "GEMINI_API_KEY=$KEY"
