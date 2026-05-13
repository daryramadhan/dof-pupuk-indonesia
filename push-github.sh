#!/usr/bin/env bash
# Push project ke https://github.com/anuhea151-boop/Pupuk-Indonesia
# Jalankan dari Terminal (di luar sandbox): chmod +x push-github.sh && ./push-github.sh

set -euo pipefail
cd "$(dirname "$0")"

REMOTE_URL="https://github.com/anuhea151-boop/Pupuk-Indonesia.git"

# Buang repositori git rusak / parsial (mis. init gagal di lingkungan terbatas)
if [[ -d .git ]] && ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Menghapus folder .git yang tidak valid..."
  rm -rf .git
fi

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  git init
  git branch -M main
fi

git remote remove origin 2>/dev/null || true
git remote add origin "$REMOTE_URL"

git add -A
if git diff --cached --quiet; then
  echo "Tidak ada perubahan baru untuk di-commit."
else
  git commit -m "Pupuk Indonesia: HR dashboard & manajemen surat"
fi

echo "Mendorong ke origin (main)..."
git push -u origin main

echo "Selesai."
