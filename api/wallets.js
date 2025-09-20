import { insertWallet, getAllWallets, getWalletCount } from '../src/server/db.js';
import { initializeDatabase } from '../src/server/vercelInit.js';

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