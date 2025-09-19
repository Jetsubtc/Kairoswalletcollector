#!/bin/bash

# Build the site
npm run build

# Create a temporary directory for the built files
mkdir -p temp-deploy
cp -r dist/* temp-deploy/

# Checkout to gh-pages branch (or create it if it doesn't exist)
git checkout -B gh-pages

# Remove all files except the temp-deploy directory
find . -maxdepth 1 ! -name 'temp-deploy' ! -name '.git' ! -name '.' -exec rm -rf {} +

# Move built files to root
cp -r temp-deploy/* .
rm -rf temp-deploy

# Add all files
git add .

# Commit and push
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# Switch back to main branch
git checkout main