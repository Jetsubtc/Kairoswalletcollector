#!/bin/bash

# Check if we're already on gh-pages branch
if [ "$(git branch --show-current)" = "gh-pages" ]; then
  echo "Already on gh-pages branch. Switching to main."
  git checkout main
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the site
echo "Building the site..."
npm run build

# Create a temporary directory for the built files
echo "Creating temporary directory..."
mkdir -p temp-deploy
cp -r dist/* temp-deploy/

# Also copy the image directory for the rabbit loading.gif
echo "Copying image directory..."
cp -r image temp-deploy/

# Create a copy of rabbit loading.gif without spaces for better compatibility
echo "Creating copy of rabbit loading.gif without spaces..."
cp "image/rabbit loading.gif" temp-deploy/image/rabbit-loading.gif

# Copy test file for debugging
echo "Copying test file..."
cp test-image-access.html temp-deploy/

# Checkout to gh-pages branch (or create it if it doesn't exist)
echo "Switching to gh-pages branch..."
git checkout -B gh-pages

# Remove all files except the temp-deploy directory
echo "Cleaning up files..."
find . -maxdepth 1 ! -name 'temp-deploy' ! -name '.git' ! -name '.' -exec rm -rf {} +

# Move built files to root
echo "Moving built files..."
cp -r temp-deploy/* .
rm -rf temp-deploy

# Add all files
echo "Adding files to git..."
git add .

# Commit and push (force push to handle any conflicts)
echo "Committing and pushing to GitHub..."
git commit -m "Deploy to GitHub Pages with image test and no-space copy"
git push origin gh-pages --force

# Switch back to main branch
echo "Switching back to main branch..."
git checkout main

echo "Deployment completed successfully!"