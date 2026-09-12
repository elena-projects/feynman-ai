# Cloud Run deployment (this is what serves feynman.elenaprojects.cc)

The app used to be hosted on Vercel, with `../api/gemini.js` as the Gemini proxy. A Vercel
serverless function hard-caps its request body at 4.5MB, and uploads travel to Gemini as
base64 inside that body, so the real upload ceiling was about 3MB of original file — the
reason the app moved here. Cloud Run accepts 32MB, so the limit is now 14MB (Gemini takes
an inline request up to ~20MB, and base64 adds roughly a third).

`../index.html` is still the only copy of the app. nginx replaces the Vercel function: it
serves that file and proxies `/api/gemini` (optionally `?model=…` for the neural-voice
model) to Gemini, injecting the API key server-side from the `GEMINI_API_KEY` env var.
The page code did not have to change.

## Deploy

    ./deploy.sh

It syncs `../index.html` into `public/`, reads the Gemini key out of the `cognicard-academic`
service in the same project (so no key is ever pasted or stored here), and deploys.

- Project `m-gemini-1127`, service `feynman-ai`, region `asia-southeast1`
- gcloud needs a modern Python; the script sets `CLOUDSDK_PYTHON` itself
- Domain mapping `feynman.elenaprojects.cc` → this service; DNS lives on Vercel's
  nameservers as a `CNAME` to `ghs.googlehosted.com`

## Two things that need an account other than elena@geminiat.work

That account has `roles/editor`, which is not enough for either of these:

- Making the service publicly reachable (`run.services.setIamPolicy`) needs
  `mike.zjj@gmail.com`, which holds `roles/run.admin`:

      gcloud run services add-iam-policy-binding feynman-ai \
        --region=asia-southeast1 --member=allUsers --role=roles/run.invoker

- Creating the domain mapping needs an account that has *verified* `elenaprojects.cc`,
  which is `elena@geminiat.work` — `mike.zjj@gmail.com` has not verified it. So the two
  steps above and below are done by different accounts:

      gcloud beta run domain-mappings create --service=feynman-ai \
        --domain=feynman.elenaprojects.cc --region=asia-southeast1 \
        --account=elena@geminiat.work

## Rolling back to Vercel

The Vercel project is untouched. Put the DNS record back:

    vercel dns add elenaprojects.cc feynman CNAME cname.vercel-dns.com

and lower the upload limit in `../index.html` back to 3MB, since the Vercel function
cannot accept more.
