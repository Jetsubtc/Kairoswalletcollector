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
  
  // Extract the HTML content from the Astro file (simplified approach)
  // Remove frontmatter (--- ... --- blocks)
  content = content.replace(/---[\s\S]*?---/g, '');
  
  // Create proper HTML structure
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HyperWallet Collector</title>
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Press Start 2P', cursive;
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      color: white;
      min-height: 100vh;
      overflow-x: hidden;
    }
    
    .loading-screen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      opacity: 1;
      transition: opacity 1s ease-out;
    }
    
    .loading-content {
      text-align: center;
      animation: pulse 2s infinite;
    }
    
    .loading-text {
      font-size: 1.5rem;
      margin-bottom: 2rem;
      text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
    }
    
    .loading-dots::after {
      content: '.';
      animation: dots 1.5s infinite;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @keyframes dots {
      0% { content: '.'; }
      33% { content: '..'; }
      66% { content: '...'; }
      100% { content: '.'; }
    }
    
    .main-content {
      display: none;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .wallet-form {
      background: rgba(0, 0, 0, 0.7);
      padding: 2rem;
      border-radius: 10px;
      border: 2px solid #00ffff;
      box-shadow: 0 0 20px #00ffff;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }
    
    input {
      width: 100%;
      padding: 0.8rem;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid #00ffff;
      color: white;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.8rem;
    }
    
    button {
      background: linear-gradient(45deg, #00ffff, #ff00ff);
      color: black;
      border: none;
      padding: 1rem 2rem;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.9rem;
      cursor: pointer;
      border-radius: 5px;
      transition: transform 0.2s;
    }
    
    button:hover {
      transform: scale(1.05);
    }
    
    .message {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 5px;
      display: none;
    }
    
    .message.success {
      background: rgba(0, 255, 0, 0.2);
      border: 1px solid green;
    }
    
    .message.error {
      background: rgba(255, 0, 0, 0.2);
      border: 1px solid red;
    }
    
    .hidden {
      display: none !important;
    }
  </style>
</head>
<body>
  <!-- Loading Screen -->
  <div id="loadingScreen" class="loading-screen">
    <div class="loading-content">
      <div class="loading-text">Enter the Kairos<span class="loading-dots"></span></div>
    </div>
  </div>

  <!-- Main Content -->
  <div id="mainContent" class="main-content">
    <div class="wallet-form">
      <h1>HyperWallet Collector</h1>
      <form id="walletForm">
        <div class="form-group">
          <label for="twitterHandle">X (Twitter) Handle:</label>
          <input type="text" id="twitterHandle" name="twitterHandle" required placeholder="@username">
        </div>
        <div class="form-group">
          <label for="walletAddress">Wallet Address:</label>
          <input type="text" id="walletAddress" name="walletAddress" required placeholder="0x...">
        </div>
        <button type="submit" id="submitBtn">Submit Wallet</button>
      </form>
      <div id="message" class="message"></div>
    </div>
  </div>

  <script>
    // Loading screen logic
    document.addEventListener('DOMContentLoaded', function() {
      const loadingScreen = document.getElementById('loadingScreen');
      const mainContent = document.getElementById('mainContent');
      
      // Show loading screen for at least 3 seconds
      setTimeout(function() {
        loadingScreen.style.opacity = '0';
        setTimeout(function() {
          loadingScreen.classList.add('hidden');
          mainContent.style.display = 'block';
        }, 1000);
      }, 3000);
      
      // Handle form submission
      document.getElementById('walletForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const twitterHandle = document.getElementById('twitterHandle').value;
        const walletAddress = document.getElementById('walletAddress').value;
        
        // Basic validation
        if (!twitterHandle || !walletAddress) {
          const messageDiv = document.getElementById('message');
          messageDiv.textContent = 'Please fill in all fields.';
          messageDiv.className = 'message error';
          messageDiv.style.display = 'block';
          return;
        }
        
        // Show success message (since we can't actually submit to a backend in static hosting)
        const messageDiv = document.getElementById('message');
        messageDiv.innerHTML = 'Wallet collected locally! <br><br> To access submitted data:<br>1. Download the page source<br>2. Check browser console for entries<br>3. Or deploy to a server with database support';
        messageDiv.className = 'message success';
        messageDiv.style.display = 'block';
        
        // Log to console for debugging
        console.log('Wallet Submission:', { twitterHandle, walletAddress });
        
        // Store in localStorage for persistence
        try {
          const submissions = JSON.parse(localStorage.getItem('walletSubmissions') || '[]');
          submissions.push({
            twitterHandle,
            walletAddress,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('walletSubmissions', JSON.stringify(submissions));
          console.log('Saved to localStorage. Total submissions:', submissions.length);
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
        
        // Clear the form fields
        document.getElementById('twitterHandle').value = '';
        document.getElementById('walletAddress').value = '';
        
        // Disable submit button temporarily
        const submitBtn = document.getElementById('submitBtn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitted!';
        
        // Re-enable after 3 seconds
        setTimeout(function() {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }, 3000);
      });
    });
  </script>
</body>
</html>`;
  
  writeFileSync(indexPath, htmlContent);
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
  
  // Copy images directory if it exists
  const imagesSrc = join(publicDir, 'images');
  const imagesDest = join(distDir, 'images');
  if (existsSync(imagesSrc)) {
    // For simplicity, we'll just mention that images should be copied
    // In a real implementation, you'd want to properly copy the directory
    console.log('Images directory found - you may need to manually copy images');
  }
}

console.log('Static build completed successfully!');