import { createWalletsTable, testConnection } from './db.js';

let isDatabaseInitialized = false;

export async function initializeDatabase() {
  if (isDatabaseInitialized) {
    return true;
  }
  
  console.log('Initializing database...');
  
  // Test the database connection
  console.log('Testing database connection...');
  const connectionSuccess = await testConnection();
  if (!connectionSuccess) {
    console.error('Failed to connect to the database. Please check your DATABASE_URL environment variable.');
    return false;
  }
  
  console.log('Database connection successful!');
  
  // Create the wallets table
  console.log('Creating wallets table...');
  const tableSuccess = await createWalletsTable();
  if (!tableSuccess) {
    console.error('Failed to create wallets table.');
    return false;
  }
  
  console.log('Wallets table created successfully!');
  isDatabaseInitialized = true;
  console.log('Database initialization completed successfully!');
  return true;
}

export default initializeDatabase;