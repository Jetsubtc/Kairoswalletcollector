const { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } = require('fs');
const { join } = require('path');

// Create dist directory if it doesn't exist
const distDir = 'dist';
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

// Read the index.astro file and convert it to static HTML
const srcIndexPath = 'src/pages/index.astro';
const indexPath = join(distDir, 'index.html');

if (existsSync(srcIndexPath)) {
  let content = readFileSync(srcIndexPath, 'utf-8');
  
  // Remove frontmatter (--- ... --- blocks)
  content = content.replace(/---[\s\S]*?---/g, '');
  
  // Remove Astro-specific attributes
  content = content.replace(/is:inline/g, '');
  
  // Remove Astro-specific expressions
  content = content.replace(/\{Astro\.generator\}/g, 'Astro Static Build');
  
  // Write the content as HTML
  writeFileSync(indexPath, content);
  console.log('Created index.html from index.astro');
} else {
  // Create a basic index.html
  const basicHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HyperWallet Collector</title>
</head>
<body>
  <div id="app">
    <h1>HyperWallet Collector</h1>
    <p>Loading...</p>
  </div>
</body>
</html>`;
  writeFileSync(indexPath, basicHtml);
  console.log('Created basic index.html');
}

// Copy files from public directory
const publicDir = 'public';
if (existsSync(publicDir)) {
  // Copy favicon files
  const faviconFiles = ['favicon.ico', 'favicon.svg'];
  faviconFiles.forEach(file => {
    const srcPath = join(publicDir, file);
    const destPath = join(distDir, file);
    if (existsSync(srcPath)) {
      copyFileSync(srcPath, destPath);
      console.log('Copied ' + file);
    }
  });
  
  // Copy the entire images directory
  const imagesSrc = join(publicDir, 'images');
  const imagesDest = join(distDir, 'images');
  if (existsSync(imagesSrc)) {
    // Create images directory in dist
    if (!existsSync(imagesDest)) {
      mkdirSync(imagesDest, { recursive: true });
    }
    
    // Copy all files in images directory
    const { readdirSync } = require('fs');
    try {
      const imageFiles = readdirSync(imagesSrc);
      imageFiles.forEach(file => {
        const srcPath = join(imagesSrc, file);
        const destPath = join(imagesDest, file);
        copyFileSync(srcPath, destPath);
        console.log('Copied image: ' + file);
      });
    } catch (err) {
      console.log('Could not copy images directory: ' + err.message);
    }
  }
}

console.log('Static build completed successfully!');