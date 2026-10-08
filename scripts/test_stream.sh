#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:4000/api/v1}"

if [[ -z "${JWT_TOKEN:-}" ]]; then
  echo "Set JWT_TOKEN to a valid Bearer token before running this test." >&2
  echo "Example: JWT_TOKEN='<token>' SONG_ID='<song-id>' ./scripts/test_stream.sh" >&2
  exit 2
fi

if [[ -z "${SONG_ID:-}" ]]; then
  if ! command -v jq >/dev/null 2>&1; then
    echo "jq is required to find a song automatically; set SONG_ID instead." >&2
    exit 2
  fi

  songs_response="$(curl -fsS \
    -H "Authorization: Bearer $JWT_TOKEN" \
    "$API_URL/songs?size=1")" || {
    echo "Could not retrieve songs from $API_URL/songs." >&2
    exit 1
  }
  SONG_ID="$(jq -r '.data[0].id // empty' <<<"$songs_response")"
  if [[ -z "$SONG_ID" ]]; then
    echo "No song ID was returned; set SONG_ID to an existing song." >&2
    exit 1
  fi
fi

body_file="$(mktemp)"
headers_file="$(mktemp)"
trap 'rm -f "$body_file" "$headers_file"' EXIT

echo "Requesting bytes 0-1023 from $API_URL/songs/$SONG_ID/stream"
status="$(curl -sS \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Range: bytes=0-1023" \
  -D "$headers_file" \
  -o "$body_file" \
  -w '%{http_code}' \
  "$API_URL/songs/$SONG_ID/stream")" || {
  echo "Request failed; check that the API is running at $API_URL." >&2
  exit 1
}

echo "HTTP status: $status"
grep -iE '^(content-type|content-length|content-range|accept-ranges):' "$headers_file" || true

if [[ "$status" != "206" ]]; then
  echo "Expected 206 Partial Content. Check the song's B2 object/key and server logs." >&2
  exit 1
fi

actual_bytes="$(wc -c <"$body_file" | tr -d '[:space:]')"
if [[ "$actual_bytes" != "1024" ]]; then
  echo "Expected 1024 response bytes, received $actual_bytes." >&2
  exit 1
fi

if ! grep -qi '^content-range: bytes 0-1023/' "$headers_file"; then
  echo "The response did not include the expected Content-Range header." >&2
  exit 1
fi

echo "PASS: received a 1024-byte partial response."
