const https = require('https');
const fs = require('fs'); // For reading certificate files
const net = require('net');

// Read SSL certificate and private key
const privateKey = fs.readFileSync('key.pem', 'utf8'); // Replace with your key file
const certificate = fs.readFileSync('cert.pem', 'utf8'); // Replace with your cert file

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
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      console.log('on data',body)
    });

    req.on('end', () => {
      try {
        const dataToPrint = JSON.parse(body).text; // Assuming JSON with 'text' field
        console.log('on end',dataToPrint)
        if (!dataToPrint) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing text data' }));
          return;
        }

        const client = net.createConnection({ port: 9100, host: '192.168.1.88' }, () => { // Replace with your printer details
          console.log('connected to printer!');
          client.write(dataToPrint + '\r\n', 'binary', () => {
              console.log("Data sent to printer");
              client.end();
          });
        });

        client.on('end', () => {
          console.log('disconnected from printer');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Print job sent' }));
        });

        client.on('error', (err) => {
          console.error('Printer error:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Printer communication error' }));
        });

      } catch (error) {
        console.error('Error processing request:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON data' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const port = 443; // Standard HTTPS port
server.listen(port, '192.168.177.132',() => {
  console.log(`HTTPS server listening on https://192.168.177.132:${port}`);
});

// const port = 3000;
// server.listen(port, '192.168.177.132', () => {
//   console.log(`HTTPS server listening on https://192.168.177.132:${port}`);
// });