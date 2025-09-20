// Temporary in-memory storage for testing
let wallets = [];
let walletCount = 0;

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
    if (request.method === 'GET') {
      // Return in-memory wallets for testing
      return response.status(200).json({
        success: true,
        count: walletCount,
        data: wallets,
        message: 'Using in-memory storage (database connection disabled for testing)'
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

      // Store in memory for testing
      const newWallet = {
        id: Date.now(),
        twitter_handle: twitterHandle,
        wallet_address: walletAddress,
        created_at: new Date().toISOString()
      };

      wallets.unshift(newWallet);
      walletCount++;

      return response.status(201).json({
        success: true,
        message: 'Wallet submitted successfully (stored in memory for testing)',
        data: {
          id: newWallet.id,
          createdAt: newWallet.created_at
        }
      });
    } else {
      response.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in wallets API:', error);
    response.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}