import { getAllWallets, getWalletCount } from '../../../src/server/db.js';
import { initializeDatabase } from '../../../src/server/vercelInit.js';

// Get admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export default async function handler(request, response) {
  // Enable CORS for all origins
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  try {
    // Initialize database
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      return response.status(500).json({ error: 'Database initialization failed' });
    }

    // Check for authorization header
    const authHeader = request.headers.authorization;
    const credentials = authHeader && authHeader.startsWith('Basic ') ? authHeader.substring(6) : null;
    
    if (!credentials) {
      return response.status(401).json({
        success: false,
        message: 'Unauthorized: Missing or invalid authorization header'
      });
    }
    
    // Decode base64 credentials
    const [username, password] = Buffer.from(credentials, 'base64').toString().split(':');
    
    // Check if credentials match
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return response.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid credentials'
      });
    }

    if (request.method === 'GET') {
      // Fetch all wallets
      const wallets = await getAllWallets();
      const count = await getWalletCount();

      // Format the data for the admin panel
      const formattedWallets = wallets.map(wallet => ({
        twitterHandle: wallet.twitter_handle,
        walletAddress: wallet.wallet_address,
        timestamp: wallet.created_at
      }));

      return response.status(200).json({
        success: true,
        count,
        wallets: formattedWallets
      });
    } else {
      response.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in admin wallets API:', error);
    response.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}