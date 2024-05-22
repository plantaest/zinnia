#!/bin/bash

# Check parameters
if [ $# -ne 2 ]; then
  echo "Missing VERSION and FILE_LINK parameters!"
  echo "Usage: ./deploy.sh <VERSION> <FILE_LINK>"
  exit 1
fi

# Get parameters
VERSION=$1
FILE_LINK=$2

# Create the builds directory if it doesn't exist
mkdir -p ~/www/static/builds

# Create the VERSION directory (handle existing directory gracefully)
VERSION_DIR=~/www/static/builds/$VERSION
if [ -d "$VERSION_DIR" ]; then
  echo "Version directory ($VERSION_DIR) already exists. Removing contents..."
  rm -rf "${VERSION_DIR:?}"/* || {
    echo "Error: Failed to remove contents of $VERSION_DIR. Please check permissions or try manually."
    exit 1
  }
fi
mkdir -p "$VERSION_DIR"

# Download zip file
curl -o "$VERSION_DIR"/zinnia.zip "$FILE_LINK"

# Unzip
cd "$VERSION_DIR" || exit
unzip zinnia.zip

# Remove zip file
rm zinnia.zip

# Display success message
echo "Done!"
