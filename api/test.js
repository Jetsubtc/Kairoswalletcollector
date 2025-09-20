export default async function handler(req, res) {
  console.log('Test API function called:', req.method, req.url);
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    res.status(200).json({ 
      message: 'Test API route working',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasAdminUsername: !!process.env.ADMIN_USERNAME
      }
    });
  } catch (error) {
    console.error('Test API error:', error);
    res.status(500).json({ 
      error: 'Test API failed',
      message: error.message 
    });
  }
}