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
  
  // Fix image path to use the correct rabbit loading.gif directly from the image directory
  // We'll reference it as ./image/rabbit%20loading.gif (URL encoded space)
  content = content.replace(/src="\/images\/loading\.gif"/g, 'src="./image/rabbit%20loading.gif"');
  content = content.replace(/src="images\/loading\.gif"/g, 'src="./image/rabbit%20loading.gif"');
  content = content.replace(/src="\.\/image\/rabbit\-loading\.gif"/g, 'src="./image/rabbit%20loading.gif"');
  
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
  
  // Copy the entire images directory if it exists (but not the rabbit loading.gif)
  const imagesSrc = join(publicDir, 'images');
  const imagesDest = join(distDir, 'images');
  if (existsSync(imagesSrc)) {
    // Create images directory in dist
    if (!existsSync(imagesDest)) {
      mkdirSync(imagesDest, { recursive: true });
    }
    
    // Copy all files in images directory except loading.gif
    const { readdirSync } = require('fs');
    try {
      const imageFiles = readdirSync(imagesSrc);
      imageFiles.forEach(file => {
        // Skip loading.gif as we're referencing the one in the image directory directly
        if (file !== 'loading.gif') {
          const srcPath = join(imagesSrc, file);
          const destPath = join(imagesDest, file);
          copyFileSync(srcPath, destPath);
          console.log('Copied image: ' + file);
        }
      });
    } catch (err) {
      console.log('Could not copy images directory: ' + err.message);
    }
  }
}

// No need to copy the rabbit loading.gif as we're referencing it directly from the source image directory
console.log('Static build completed successfully!');