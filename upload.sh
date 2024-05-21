#!/bin/bash

ZIP_NAME="zinnia.zip"

cd apps/zinnia-core/dist || exit

zip -r ../../../$ZIP_NAME assets locales

cd ../../../

echo "Successfully created zip file: $ZIP_NAME"

CURRENT_TIME=$(date +%s)
EXPIRATION_TIME=$((CURRENT_TIME + 3600))
EXPIRATION=$(date -u -r $EXPIRATION_TIME +"%Y-%m-%dT%H:%M:%SZ")

RESPONSE=$(curl -s -X 'POST' \
  'https://file.io/' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@zinnia.zip;type=text/html' \
  -F "expires=$EXPIRATION" \
  -F 'maxDownloads=1' \
  -F 'autoDelete=true')

LINK=$(echo "$RESPONSE" | grep -o '"link":"[^"]*"' | sed 's/"link":"\([^"]*\)"/\1/')

echo "Uploaded zinnia.zip. Download link: $LINK"

rm zinnia.zip
