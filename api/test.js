module.exports = (req, res) => {
  res.status(200).json({ 
    message: 'Test API route working',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
};