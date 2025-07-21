#!/bin/bash

# Aether WASM Build Script
# Builds the Rust project as WebAssembly and sets up the web demo

set -e

echo "🚀 Building Aether WASM..."

# Check if wasm-pack is installed
if ! command -v wasm-pack &> /dev/null; then
    echo "❌ wasm-pack not found. Installing..."
    cargo install wasm-pack
fi

# Build the WASM module
echo "📦 Building WASM module..."
wasm-pack build --target web --out-dir web/pkg

# Verify the build
if [ -f "web/pkg/aether.js" ]; then
    echo "✅ WASM build successful!"
    echo "📂 Files generated in web/pkg/"
    ls -la web/pkg/
else
    echo "❌ WASM build failed!"
    exit 1
fi

# Create web directory if it doesn't exist
mkdir -p web

echo ""
echo "🎉 Build complete!"
echo ""
echo "To run the demo:"
echo "  cd web"
echo "  python3 -m http.server 8000"
echo ""
echo "Then open: http://localhost:8000" 