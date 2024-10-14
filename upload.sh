#!/bin/bash

ZIP_NAME="zinnia.zip"

cd apps/zinnia-core/dist || exit
zip -r ../../../$ZIP_NAME assets
cd ../../../
echo "Successfully created zip file: $ZIP_NAME"

RESPONSE=$(curl -F "file=@zinnia.zip" https://tmpfiles.org/api/v1/upload)
echo "Response: $RESPONSE"

LINK=$(echo "$RESPONSE" | grep -o '"url":"[^"]*"' | cut -d'"' -f4 | sed 's|tmpfiles.org|tmpfiles.org/dl|')
echo "Uploaded zinnia.zip. Download link: $LINK"

rm zinnia.zip
