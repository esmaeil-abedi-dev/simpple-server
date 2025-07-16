#!/bin/bash
echo "=== Environment Variables ==="
printenv | grep -E 'NODE_ENV|DATABASE|POSTGRES|PRISMA'

echo "=== Project Structure ==="
find . -type f -name "*.js" | grep -v "node_modules"

echo "=== TypeScript Config ==="
cat tsconfig.json

echo "=== Prisma Schema ==="
cat prisma/schema.prisma

echo "=== Running Build ==="
npm run vercel-build
