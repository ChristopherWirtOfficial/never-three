#!/bin/bash
set -e

cd /home/claude/never-three

echo "=== Type checking ==="
npx tsc --noEmit
echo "✅ Types OK"

echo ""
echo "=== Bundling ==="
mkdir -p dist
npx esbuild src/index.tsx \
  --bundle \
  --format=esm \
  --external:react \
  --jsx=preserve \
  --loader:.tsx=tsx \
  --loader:.ts=ts \
  --target=es2020 \
  --outfile=dist/never-three.jsx

echo "✅ Bundle: dist/never-three.jsx"
echo ""
wc -l dist/never-three.jsx | awk '{print "   " $1 " lines"}'
