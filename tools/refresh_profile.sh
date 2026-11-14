#!/usr/bin/env bash
# SPDX-License-Identifier: AGPL-3.0-or-later
# Commercial license available
# © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
# © Code 2020–2026 Miroslav Šotek. All rights reserved.
# ORCID: 0009-0009-3560-0851
# Contact: www.anulum.li | protoscience@anulum.li
# ANULUM — Canonical profile refresh
# Local, canonical refresh of the profile's live surfaces.
#
# 1. fetch the release feed and the Zenodo inventory into tools/feeds.json,
# 2. render the README blocks and PUBLICATIONS.md,
# 3. run the online validation; when every target passes, stamp today's date as
#    verified_at (manifest + README markers),
# 4. run the offline validator and the profile test modules,
# 5. commit in the local repository when something changed, under the SYNAPSE
#    identity CEO/profile-refresh with a claim on the regenerated paths; a
#    refused claim or commit restores those paths. Never pushes: publication
#    of the commit stays a separate, approved step.
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
for test_pattern in 'test_profile_*.py' 'test_render_*.py' 'test_validate_profile*.py'; do
  python3 -m unittest discover -s tests -p "$test_pattern"
done

if git diff --quiet; then
  echo "nothing changed"
  exit 0
fi

REFRESH_PATHS=(tools/feeds.json PUBLICATIONS.md profile-data.json README.md README.de.md README.sk.md README.zh-CN.md README.ja.md)

# The pre-commit hook admits only staged paths covered by a SYNAPSE claim of
# $SYN_IDENTITY. The systemd user manager can inherit a stale terminal identity,
# so the refresh always commits under its own identity and claims its paths
# first (released by the commit). If the claim or the commit is refused, the
# regenerated files are restored so that tomorrow's run starts from a clean
# tree; they are rebuilt from the same sources on the next run.
export SYN_PROJECT=CEO
export SYN_IDENTITY=CEO/profile-refresh
SYNAPSE_BIN="${SYNAPSE_BIN:-$HOME/.local/bin/synapse}"
restore_refresh() {
  echo "$1; restoring the regenerated files so the next run starts clean"
  git restore --staged --worktree -- "${REFRESH_PATHS[@]}"
  exit 3
}
claim_args=()
for path in "${REFRESH_PATHS[@]}"; do claim_args+=(--paths "$path"); done
"$SYNAPSE_BIN" git-claim --task-id "profile-refresh-$TODAY" "${claim_args[@]}" \
  --name "$SYN_IDENTITY" --auto-release-on commit \
  --intent "daily profile refresh (anulum-profile-refresh.timer)" \
  || restore_refresh "claim refused"

git add "${REFRESH_PATHS[@]}"
git commit -q -F - <<'MSG' || restore_refresh "commit refused"
docs(profile): refresh release feed, Zenodo inventory and verification date

Automated local refresh of the live README blocks and PUBLICATIONS.md from
anulum.li/news/feed.xml and the Zenodo records of the owner's ORCID; the
verification date moves only when every online target passed.

Authored by Anulum Fortis & Arcane Sapience (protoscience@anulum.li)
Automation: anulum-profile-refresh.timer
MSG
echo "committed $(git rev-parse --short HEAD) (local only; push is a separate step)"
# Commit-triggered release did not always drop the claim (observed 14 Nov 2026),
# so release it explicitly; a claim that is already gone is not an error.
"$SYNAPSE_BIN" release "profile-refresh-$TODAY" --name "$SYN_IDENTITY" || true
