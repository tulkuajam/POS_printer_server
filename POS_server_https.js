const https = require('https');
const fs = require('fs'); // For reading certificate files
const net = require('net');

// Read SSL certificate and private key
const privateKey = fs.readFileSync('../key.pem', 'utf8'); // Replace with your key file
const certificate = fs.readFileSync('../cert.pem', 'utf8'); // Replace with your cert file

const credentials = {
  key: privateKey,
  cert: certificate,
};

const server = https.createServer(credentials, (req, res) => {
  // Your existing HTTP request handling code (CORS, /print endpoint, etc.)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/print') {
      //...The rest of your print code here.
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const port = 443; // Standard HTTPS port
server.listen(port, () => {
  console.log(`HTTPS server listening on port ${port}`);
});
