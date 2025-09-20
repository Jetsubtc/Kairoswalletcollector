import { getAllWallets, getWalletCount } from '../../../server/db.js';
import { initializeDatabase } from '../../../server/vercelInit.js';

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

// Helper function to extract credentials from different request formats
function getCredentials(request) {
  // For Astro API format
  if (request.headers && typeof request.headers.get === 'function') {
    const authHeader = request.headers.get('authorization');
    return authHeader && authHeader.startsWith('Basic ') ? authHeader.substring(6) : null;
  }
  
  // For Vercel serverless function format
  if (request.headers && request.headers.authorization) {
    const authHeader = request.headers.authorization;
    return authHeader && authHeader.startsWith('Basic ') ? authHeader.substring(6) : null;
  }
  
  return null;
}

// Ensure database is initialized
let isDatabaseInitialized = false;

async function ensureDatabaseInitialized() {
  if (!isDatabaseInitialized) {
    try {
      const success = await initializeDatabase();
      if (!success) {
        throw new Error('Database initialization failed');
      }
      isDatabaseInitialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }
}

export async function get({ request }) {
  try {
    // Ensure database is initialized
    await ensureDatabaseInitialized();
    
    // Extract credentials
    const credentials = getCredentials(request);
    
    // Check for authorization header
    if (!credentials) {
      return {
        status: 401,
        body: {
          success: false,
          message: 'Unauthorized: Missing or invalid authorization header'
        }
      };
    }
    
    // Validate credentials
    if (!authenticate(credentials)) {
      return {
        status: 401,
        body: {
          success: false,
          message: 'Unauthorized: Invalid credentials'
        }
      };
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

    return {
      status: 200,
      body: {
        success: true,
        count,
        wallets: formattedWallets
      }
    };
  } catch (error) {
    console.error('Error fetching wallets for admin:', error);

    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error'
      }
    };
  }
}

// Vercel serverless function handler
export default async function handler(request, response) {
  if (request.method === 'GET') {
    const result = await get({ request });
    response.status(result.status).json(result.body);
  } else {
    response.status(405).json({ success: false, message: 'Method not allowed' });
  }
}