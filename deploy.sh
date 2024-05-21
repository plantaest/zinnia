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

# Create the directory for the VERSION
VERSION_DIR=~/www/static/builds/$VERSION
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
