#!/usr/bin/env bash
set -euo pipefail

PLUGIN_DIR="$(pwd)"
PLUGIN_NAME=$(python3 -c "import json; print(json.load(open('plugin.json'))['name'])")
OUT_DIR="${PLUGIN_DIR}/out"

echo "Building plugin '${PLUGIN_NAME}' in ${PLUGIN_DIR}"

# Create out/ before Docker runs so it's owned by the host user, not root.
mkdir -p "${OUT_DIR}"

# Run the Decky builder image directly instead of via the CLI, which fails on
# Apple Silicon because pnpm can't resolve the correct rollup native bindings
# under QEMU emulation (cli#24, template#52).
#
# -v /plugin/node_modules creates an anonymous volume that shadows the host's
# node_modules inside the container, so the host's ARM deps stay untouched
# while the container installs its own linux/x64 deps.
docker run --rm \
  --platform linux/amd64 \
  -v "${PLUGIN_DIR}:/plugin" \
  -v /plugin/node_modules \
  -w /plugin \
  ghcr.io/steamdeckhomebrew/builder:latest \
  sh -c "pnpm install && pnpm build"

# Package into a zip matching the structure the Decky CLI produces:
#   PluginName/dist/index.js, package.json, plugin.json, LICENSE
TMP_DIR=$(mktemp -d)
mkdir -p "${OUT_DIR}" "${TMP_DIR}/${PLUGIN_NAME}"
cp plugin.json package.json "${TMP_DIR}/${PLUGIN_NAME}/"
cp -r dist "${TMP_DIR}/${PLUGIN_NAME}/"
[ -f LICENSE ] && cp LICENSE "${TMP_DIR}/${PLUGIN_NAME}/"
(cd "${TMP_DIR}" && zip -r "${OUT_DIR}/${PLUGIN_NAME}.zip" "${PLUGIN_NAME}")
rm -rf "${TMP_DIR}"

echo "Built ${OUT_DIR}/${PLUGIN_NAME}.zip"
