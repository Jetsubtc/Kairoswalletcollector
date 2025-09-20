import { insertWallet, getAllWallets, getWalletCount } from '../../server/db.js';
import { initializeDatabase } from '../../server/initDb.js';

// Ensure database is initialized
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

export async function post({ request }) {
  try {
    // Ensure database is initialized
    await ensureDatabaseInitialized();
    
    // Handle different request formats
    let requestData;
    if (typeof request.json === 'function') {
      // Astro API format
      requestData = await request.json();
    } else if (request.body) {
      // Vercel serverless function format
      requestData = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    } else {
      throw new Error('Invalid request format');
    }
    
    const { twitterHandle, walletAddress } = requestData;

    // Validate input
    if (!twitterHandle || !walletAddress) {
      return {
        status: 400,
        body: {
          error: 'Twitter handle and wallet address are required'
        }
      };
    }

    // Validate wallet address format (basic EVM address validation)
    const walletRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!walletRegex.test(walletAddress)) {
      return {
        status: 400,
        body: {
          error: 'Invalid wallet address format'
        }
      };
    }

    // Insert wallet into database
    const result = await insertWallet(twitterHandle, walletAddress);

    return {
      status: 201,
      body: {
        success: true,
        message: 'Wallet submitted successfully',
        data: {
          id: result.id,
          createdAt: result.created_at
        }
      }
    };
  } catch (error) {
    console.error('Error submitting wallet:', error);

    // Handle duplicate entry
    if (error.code === '23505') {
      return {
        status: 409,
        body: {
          error: 'This Twitter handle and wallet address combination already exists'
        }
      };
    }

    return {
      status: 500,
      body: {
        error: 'Internal server error'
      }
    };
  }
}

export async function get() {
  try {
    // Ensure database is initialized
    await ensureDatabaseInitialized();
    
    // Fetch all wallets (in a real app, you might want to add pagination)
    const wallets = await getAllWallets();
    const count = await getWalletCount();

    return {
      status: 200,
      body: {
        success: true,
        count,
        data: wallets
      }
    };
  } catch (error) {
    console.error('Error fetching wallets:', error);

    return {
      status: 500,
      body: {
        error: 'Internal server error'
      }
    };
  }
}

// Vercel serverless function handler
export default async function handler(request, response) {
  if (request.method === 'GET') {
    const result = await get();
    response.status(result.status).json(result.body);
  } else if (request.method === 'POST') {
    const result = await post({ request });
    response.status(result.status).json(result.body);
  } else {
    response.status(405).json({ error: 'Method not allowed' });
  }
}