#!/bin/bash
export DATABASE_URL="postgresql://ebbeelsborg@localhost:5432/interview_prep_tracker"
export PORT=3000
export NODE_ENV=development

cd "$(dirname "$0")"
npx tsx server/index.ts

