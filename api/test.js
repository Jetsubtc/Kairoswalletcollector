export default function handler(request, response) {
  response.status(200).json({ 
    message: 'Test API route working',
    timestamp: new Date().toISOString()
  });
}