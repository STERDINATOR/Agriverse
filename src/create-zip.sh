#!/bin/bash

# AgriVerse ZIP Creation Script
# This script creates a distributable ZIP file of the project

echo "🌱 Creating AgriVerse ZIP package..."

# Set the project name
PROJECT_NAME="agriverse-climate-game"
OUTPUT_FILE="${PROJECT_NAME}.zip"

# Remove old zip if exists
if [ -f "$OUTPUT_FILE" ]; then
    echo "Removing old ZIP file..."
    rm "$OUTPUT_FILE"
fi

# Create ZIP excluding unnecessary files
echo "Packaging files..."
zip -r "$OUTPUT_FILE" . \
  -x "*/node_modules/*" \
  -x "*/.git/*" \
  -x "*/dist/*" \
  -x "*/build/*" \
  -x "*/.cache/*" \
  -x "*/.vscode/*" \
  -x "*/.idea/*" \
  -x "*.log" \
  -x "*.tmp" \
  -x "*.temp" \
  -x ".DS_Store" \
  -x "*/Thumbs.db" \
  -x "${OUTPUT_FILE}"

# Check if successful
if [ -f "$OUTPUT_FILE" ]; then
    FILE_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
    echo "✅ Success! Created: $OUTPUT_FILE ($FILE_SIZE)"
    echo ""
    echo "📍 Location: $(pwd)/$OUTPUT_FILE"
    echo ""
    echo "Next steps:"
    echo "1. Share the ZIP file directly"
    echo "2. Or upload to GitHub for easy sharing"
    echo "3. Extract with: unzip $OUTPUT_FILE"
else
    echo "❌ Error: Failed to create ZIP file"
    exit 1
fi
