import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Import and use API routes
const walletsApi = await import('./src/pages/api/wallets.js');
const adminWalletsApi = await import('./src/pages/api/admin/wallets.js');

// Handle API routes BEFORE static file serving
app.get('/api/wallets', async (req, res) => {
  try {
    const response = await walletsApi.get();
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Error in GET /api/wallets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/wallets', async (req, res) => {
  try {
    const mockRequest = {
      json: async () => req.body
    };
    const response = await walletsApi.post({ request: mockRequest });
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Error in POST /api/wallets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin API routes
app.get('/api/admin/wallets', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const credentials = authHeader && authHeader.startsWith('Basic ') ? authHeader.substring(6) : null;
    
    const mockRequest = {
      headers: {
        get: (name) => {
          if (name.toLowerCase() === 'authorization') {
            return `Basic ${credentials}`;
          }
          return req.headers[name.toLowerCase()];
        }
      }
    };
    
    const response = await adminWalletsApi.get({ request: mockRequest });
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Error in GET /api/admin/wallets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Create HTTP server
const server = createServer(app);

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});