import { getWalletEntryCount } from '../../utils/dataHandler.js';

export const prerender = false;

export async function GET() {
  try {
    const count = await getWalletEntryCount();
    return new Response(
      JSON.stringify({ count }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('API Error:', error);
    // Return 0 as fallback
    return new Response(
      JSON.stringify({ count: 0 }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}