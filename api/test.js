export default function handler(request, response) {
  return response.status(200).json({ message: 'Test API route working' });
}