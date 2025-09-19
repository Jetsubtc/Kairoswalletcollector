import fs from 'fs';
import path from 'path';
import { addWallet, getAllWallets, getWalletCount } from './database.js';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'wallets.json');

// Read data from JSON file
export function readData() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return [];
  }
}

// Write data to JSON file
export function writeData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data:', error);
    return false;
  }
}

// Add a new wallet entry
export async function addWalletEntry(walletData) {
  try {
    // Try to add to database first
    const result = await addWallet(walletData);
    
    // If database is not available or operation failed, fall back to JSON file
    if (!result.success) {
      console.log('Database not available, falling back to JSON file');
      const wallets = readData();
      
      // Check if wallet already exists
      const existingWallet = wallets.find(w => w.walletAddress === walletData.walletAddress);
      if (existingWallet) {
        return {
          success: false,
          message: 'Wallet address already exists'
        };
      }
      
      // Add new wallet
      wallets.push({
        id: wallets.length + 1,
        twitterHandle: walletData.twitterHandle,
        walletAddress: walletData.walletAddress,
        timestamp: new Date().toISOString()
      });
      
      writeData(wallets);
      
      return {
        success: true,
        message: 'Wallet added successfully',
        data: wallets[wallets.length - 1]
      };
    }
    
    return result;
  } catch (error) {
    console.error('Error in addWalletEntry:', error);
    return {
      success: false,
      message: 'Failed to add wallet'
    };
  }
}

// Get all wallets
export async function getAllWalletEntries() {
  try {
    // Try to get from database first
    const dbWallets = await getAllWallets();
    
    // If database is not available, fall back to JSON file
    if (dbWallets.length === 0) {
      console.log('Database not available, falling back to JSON file');
      return readData();
    }
    
    return dbWallets;
  } catch (error) {
    console.error('Error in getAllWalletEntries:', error);
    return readData(); // Fall back to JSON file
  }
}

// Get wallet count
export async function getWalletEntryCount() {
  try {
    // Try to get count from database first
    const count = await getWalletCount();
    
    // If database is not available, fall back to JSON file
    if (count === 0) {
      console.log('Database not available, falling back to JSON file');
      const wallets = readData();
      return wallets.length;
    }
    
    return count;
  } catch (error) {
    console.error('Error in getWalletEntryCount:', error);
    const wallets = readData(); // Fall back to JSON file
    return wallets.length;
  }
}