import pg from 'pg';

const { Pool } = pg;

// PostgreSQL connection pool - created per function invocation
let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
      } : false,
      max: 1, // Limit connections for serverless
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  return pool;
}

// Database functions
async function insertWallet(twitterHandle, walletAddress) {
  const query = `
    INSERT INTO wallets (twitter_handle, wallet_address)
    VALUES ($1, $2)
    RETURNING id, created_at;
  `;

  try {
    const pool = getPool();
    const client = await pool.connect();
    const result = await client.query(query, [twitterHandle, walletAddress]);
    client.release();
    return result.rows[0];
  } catch (err) {
    console.error('Error inserting wallet:', err);
    throw err;
  }
}

async function getAllWallets() {
  const query = `
    SELECT id, twitter_handle, wallet_address, created_at
    FROM wallets
    ORDER BY created_at DESC;
  `;

  try {
    const pool = getPool();
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
    const pool = getPool();
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
    const pool = getPool();
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

export default async function handler(request, response) {
  console.log('API Wallets function called:', request.method, request.url);
  
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

    if (request.method === 'GET') {
      // Fetch all wallets
      const wallets = await getAllWallets();
      const count = await getWalletCount();

      return response.status(200).json({
        success: true,
        count,
        data: wallets
      });
    } else if (request.method === 'POST') {
      let body;
      try {
        body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
      } catch (parseError) {
        return response.status(400).json({
          error: 'Invalid JSON in request body'
        });
      }

      const { twitterHandle, walletAddress } = body;

      // Validate input
      if (!twitterHandle || !walletAddress) {
        return response.status(400).json({
          error: 'Twitter handle and wallet address are required'
        });
      }

      // Validate wallet address format (basic EVM address validation)
      const walletRegex = /^0x[a-fA-F0-9]{40}$/;
      if (!walletRegex.test(walletAddress)) {
        return response.status(400).json({
          error: 'Invalid wallet address format'
        });
      }

      // Insert wallet into database
      const result = await insertWallet(twitterHandle, walletAddress);

      return response.status(201).json({
        success: true,
        message: 'Wallet submitted successfully',
        data: {
          id: result.id,
          createdAt: result.created_at
        }
      });
    } else {
      response.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in wallets API:', error);

    // Handle duplicate entry
    if (error.code === '23505') {
      return response.status(409).json({
        error: 'This Twitter handle and wallet address combination already exists'
      });
    }

    response.status(500).json({
      error: 'Internal server error'
    });
  }
}