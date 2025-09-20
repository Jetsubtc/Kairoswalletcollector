import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

// Database functions
async function getAllWallets() {
  const query = `
    SELECT id, twitter_handle, wallet_address, created_at
    FROM wallets
    ORDER BY created_at DESC;
  `;

  try {
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();
    return result.rows;
  } catch (err) {
    console.error('Error fetching wallets:', err);
    throw err;
  }
}

async function getWalletCount() {
  const query = `
    SELECT COUNT(*) as count
    FROM wallets;
  `;

  try {
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();
    return parseInt(result.rows[0].count);
  } catch (err) {
    console.error('Error fetching wallet count:', err);
    throw err;
  }
}

async function createWalletsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS wallets (
      id SERIAL PRIMARY KEY,
      twitter_handle VARCHAR(100) NOT NULL,
      wallet_address VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(twitter_handle, wallet_address)
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(query);
    console.log('Wallets table created or already exists');
    client.release();
    return true;
  } catch (err) {
    console.error('Error creating wallets table:', err);
    return false;
  }
}

async function initializeDatabase() {
  try {
    await createWalletsTable();
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}

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