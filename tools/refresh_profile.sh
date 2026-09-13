#!/usr/bin/env bash
# SPDX-License-Identifier: AGPL-3.0-or-later
# Local, canonical refresh of the profile's live surfaces.
#
# 1. fetch the release feed and the Zenodo inventory into tools/feeds.json,
# 2. render the README blocks and PUBLICATIONS.md,
# 3. run the online validation; when every target passes, stamp today's date as
#    verified_at (manifest + README markers),
# 4. run the offline validator and the tests,
# 5. commit in the local repository when something changed. Never pushes:
#    publication of the commit stays a separate, approved step.
#
# Run by the anulum-profile-refresh systemd user timer (tools/systemd/) or by hand:
#   tools/refresh_profile.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
export PYTHONUNBUFFERED=1
LOG_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/anulum-profile-refresh"
mkdir -p "$LOG_DIR"
STAMP="$(date -u +%Y-%m-%dT%H%M%SZ)"
LOG="$LOG_DIR/refresh_${STAMP}.log"
exec > >(tee -a "$LOG") 2>&1

echo "== anulum profile refresh $STAMP in $ROOT"
if [[ -n "$(git status --porcelain)" ]]; then
  echo "refusing to run: working tree is not clean"
  git status --short
  exit 2
fi

python3 tools/profile_feeds.py --refresh
python3 tools/render_publications.py

TODAY="$(date -u +%F)"
if python3 tools/validate_profile_online.py; then
  python3 tools/profile_feeds.py --verified "$TODAY"
  python3 tools/render_publications.py
  echo "online validation passed: verified_at -> $TODAY"
else
  echo "online validation did not pass: verified_at unchanged"
fi

python3 tools/validate_profile.py
python3 tools/render_profile_assets.py --check
python3 -m unittest discover -s tests -p "test_*.py"

if git diff --quiet; then
  echo "nothing changed"
  exit 0
fi

git add tools/feeds.json PUBLICATIONS.md profile-data.json README.md README.de.md README.sk.md README.zh-CN.md README.ja.md
git commit -q -F - <<'MSG'
docs(profile): refresh release feed, Zenodo inventory and verification date

Automated local refresh of the live README blocks and PUBLICATIONS.md from
anulum.li/news/feed.xml and the Zenodo records of the owner's ORCID; the
verification date moves only when every online target passed.

Authored by Anulum Fortis & Arcane Sapience (protoscience@anulum.li)
Automation: anulum-profile-refresh.timer
MSG
echo "committed $(git rev-parse --short HEAD) (local only; push is a separate step)"
