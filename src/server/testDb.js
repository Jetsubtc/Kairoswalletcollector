import { insertWallet, getAllWallets, getWalletCount } from './db.js';

export async function testDatabase() {
  console.log('Testing database functionality...');
  
  try {
    // Test inserting a wallet
    console.log('Inserting test wallet...');
    const result = await insertWallet('testuser', '0x1234567890123456789012345678901234567890');
    console.log('Insert result:', result);
    
    // Test getting wallet count
    console.log('Getting wallet count...');
    const count = await getWalletCount();
    console.log('Wallet count:', count);
    
    // Test getting all wallets
    console.log('Getting all wallets...');
    const wallets = await getAllWallets();
    console.log('Wallets retrieved:', wallets.length);
    
    console.log('Database test completed successfully!');
  } catch (error) {
    console.error('Database test failed:', error);
    console.error('Error details:', error.message);
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testDatabase().catch(console.error);
}

export default testDatabase;