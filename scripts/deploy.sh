#!/usr/bin/env bash
set -euo pipefail

PLUGIN_DIR="$(pwd)"
PLUGIN_NAME=$(python3 -c "import json; print(json.load(open('plugin.json'))['name'])")
DECK_JSON="${PLUGIN_DIR}/deck.json"

if [[ ! -f "${DECK_JSON}" ]]; then
  echo "Error: deck.json not found. Copy deck.example.json to deck.json and fill in your Deck's connection details."
  exit 1
fi

eval "$(python3 -c "
import json, os, shlex

def expand(val):
    return os.path.expanduser(os.path.expandvars(val))

cfg = json.load(open('${DECK_JSON}'))
print(f'DECK_IP={shlex.quote(cfg[\"deckip\"])}')
print(f'DECK_PORT={shlex.quote(cfg[\"deckport\"])}')
print(f'DECK_USER={shlex.quote(cfg[\"deckuser\"])}')
print(f'DECK_DIR={shlex.quote(expand(cfg[\"deckdir\"]))}')
")"

read -rsp "Password for ${DECK_USER}@${DECK_IP}: " DECK_PASS
echo

PLUGINS_DIR="${DECK_DIR}/homebrew/plugins"
SAFE_NAME=$(echo "${PLUGIN_NAME}" | sed 's| |-|g')
SSH_TARGET="${DECK_USER}@${DECK_IP}"
CTRL_SOCK="/tmp/deck-deploy-$$"
SSH_OPTS="-p ${DECK_PORT} -o ControlMaster=auto -o ControlPath=${CTRL_SOCK} -o ControlPersist=60"

# Set up SSH_ASKPASS so the stored password is fed to SSH automatically
ASKPASS_HELPER=$(mktemp "${TMPDIR:-/tmp}/deck-askpass.XXXXXX")
chmod 700 "${ASKPASS_HELPER}"
printf '#!/bin/sh\nprintf "%%s\\n" "$DECK_PASS"\n' > "${ASKPASS_HELPER}"
export SSH_ASKPASS="${ASKPASS_HELPER}"
export SSH_ASKPASS_REQUIRE=force
export DECK_PASS

cleanup() {
  unset DECK_PASS
  ssh -o ControlPath="${CTRL_SOCK}" -O exit "${SSH_TARGET}" 2>/dev/null || true
  rm -f "${ASKPASS_HELPER}"
}
trap cleanup EXIT

# Authenticate once — all subsequent ssh/rsync reuse this connection
echo "Connecting to ${SSH_TARGET}..."
ssh ${SSH_OPTS} "${SSH_TARGET}" true

echo "Deploying '${PLUGIN_NAME}'..."

# Upload to /tmp (no permissions needed), then sudo move into plugins dir
rsync -azp --rsh="ssh ${SSH_OPTS}" out/ "${SSH_TARGET}:/tmp/decky-deploy/"

# Pipe password via stdin to avoid it appearing in process listings or command strings
printf '%s\n' "${DECK_PASS}" | ssh ${SSH_OPTS} "${SSH_TARGET}" "
  sudo -S bash -c '
    mkdir -p \"${PLUGINS_DIR}/${SAFE_NAME}\" &&
    bsdtar -xzpf \"/tmp/decky-deploy/${PLUGIN_NAME}.zip\" \
      -C \"${PLUGINS_DIR}/${SAFE_NAME}\" --strip-components=1 --fflags &&
    chown -R ${DECK_USER}:${DECK_USER} \"${PLUGINS_DIR}/${SAFE_NAME}\" &&
    rm -rf /tmp/decky-deploy &&
    systemctl restart plugin_loader
  '
"

echo "Deployed and restarted plugin_loader on ${DECK_IP}"
