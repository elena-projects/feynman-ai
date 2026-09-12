#!/bin/sh
# The app is one file, ../index.html, and Cloud Run serves that same file. Copy it into
# the Docker build context so there is one file to edit, not two.
set -e
here=$(cd "$(dirname "$0")" && pwd)
mkdir -p "$here/public"
cp "$here/../index.html" "$here/public/index.html"
cp "$here/../favicon.svg" "$here/public/favicon.svg"
# The working copies are mode 600; nginx runs as its own user and would 403 on them.
chmod a+r "$here/public/index.html" "$here/public/favicon.svg"
echo "synced -> $here/public"
