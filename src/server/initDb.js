import { createWalletsTable, testConnection } from './db.js';

export async function initializeDatabase() {
  console.log('Initializing database...');
  
  // Test the database connection
  console.log('Testing database connection...');
  const connectionSuccess = await testConnection();
  if (!connectionSuccess) {
    console.error('Failed to connect to the database. Please check your DATABASE_URL environment variable.');
    process.exit(1);
  }
  
  console.log('Database connection successful!');
  
  // Create the wallets table
  console.log('Creating wallets table...');
  const tableSuccess = await createWalletsTable();
  if (!tableSuccess) {
    console.error('Failed to create wallets table.');
    process.exit(1);
  }
  
  console.log('Wallets table created successfully!');
  console.log('Database initialization completed successfully!');
}

// Run the initialization if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase().catch(console.error);
}

export default initializeDatabase;