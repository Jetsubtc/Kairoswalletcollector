import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import { insertWallet, getAllWallets, getWalletCount } from './src/server/db.js';
import { initializeDatabase } from './src/server/initDb.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize database
let isDatabaseInitialized = false;

async function ensureDatabaseInitialized() {
  if (!isDatabaseInitialized) {
    try {
      await initializeDatabase();
      isDatabaseInitialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }
}

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Get admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Simple authentication function
function authenticate(credentials) {
  if (!credentials) return false;
  
  // Decode base64 credentials
  const [username, password] = Buffer.from(credentials, 'base64').toString().split(':');
  
  // Check if credentials match
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

// Handle API routes
app.get('/api/wallets', async (req, res) => {
  try {
    // Ensure database is initialized
    await ensureDatabaseInitialized();
    
    // Fetch all wallets
    const wallets = await getAllWallets();
    const count = await getWalletCount();

    res.status(200).json({
      success: true,
      count,
      data: wallets
    });
  } catch (error) {
    console.error('Error fetching wallets:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

app.post('/api/wallets', async (req, res) => {
  try {
    // Ensure database is initialized
    await ensureDatabaseInitialized();
    
    const { twitterHandle, walletAddress } = req.body;

    // Validate input
    if (!twitterHandle || !walletAddress) {
      return res.status(400).json({
        error: 'Twitter handle and wallet address are required'
      });
    }

    // Validate wallet address format (basic EVM address validation)
    const walletRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!walletRegex.test(walletAddress)) {
      return res.status(400).json({
        error: 'Invalid wallet address format'
      });
    }

    // Insert wallet into database
    const result = await insertWallet(twitterHandle, walletAddress);

    res.status(201).json({
      success: true,
      message: 'Wallet submitted successfully',
      data: {
        id: result.id,
        createdAt: result.created_at
      }
    });
  } catch (error) {
    console.error('Error submitting wallet:', error);

    // Handle duplicate entry
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'This Twitter handle and wallet address combination already exists'
      });
    }

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Admin API routes
app.get('/api/admin/wallets', async (req, res) => {
  try {
    // Ensure database is initialized
    await ensureDatabaseInitialized();
    
    // Check for authorization header
    const authHeader = req.headers.authorization;
    const credentials = authHeader && authHeader.startsWith('Basic ') ? authHeader.substring(6) : null;
    
    if (!credentials) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Missing or invalid authorization header'
      });
    }
    
    // Validate credentials
    if (!authenticate(credentials)) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid credentials'
      });
    }

    // Fetch all wallets
    const wallets = await getAllWallets();
    const count = await getWalletCount();

    // Format the data for the admin panel
    const formattedWallets = wallets.map(wallet => ({
      twitterHandle: wallet.twitter_handle,
      walletAddress: wallet.wallet_address,
      timestamp: wallet.created_at
    }));

    res.status(200).json({
      success: true,
      count,
      wallets: formattedWallets
    });
  } catch (error) {
    console.error('Error fetching wallets for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Create HTTP server
const server = createServer(app);

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});