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

// Test the database connection
export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Database connection successful');
    client.release();
    return true;
  } catch (err) {
    console.error('Database connection failed:', err);
    return false;
  }
}

// Create the wallets table if it doesn't exist
export async function createWalletsTable() {
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

// Insert a new wallet submission
export async function insertWallet(twitterHandle, walletAddress) {
  const query = `
    INSERT INTO wallets (twitter_handle, wallet_address)
    VALUES ($1, $2)
    RETURNING id, created_at;
  `;

  try {
    const client = await pool.connect();
    const result = await client.query(query, [twitterHandle, walletAddress]);
    client.release();
    return result.rows[0];
  } catch (err) {
    console.error('Error inserting wallet:', err);
    throw err;
  }
}

// Get all wallet submissions
export async function getAllWallets() {
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

// Get wallet count
export async function getWalletCount() {
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

export default pool;