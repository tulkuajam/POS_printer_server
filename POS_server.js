const net = require('net');
const http = require('http');

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or specify your origin
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

   if (req.url === '/') { // Handle root URL
     console.log({ message: 'Thermal printer server is running' })
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Thermal printer server is running' }));
    return;
  }

  if (req.method === 'POST' && req.url === '/print') {
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

// const port = 3000; // Choose a port for your server
// server.listen(port, () => {
//   console.log(`Server2 listening on port ${port}`);
// });

const port = 3000; // Standard HTTPS port
// const ip   = '192.168.177.149'
const ip   = '192.168.1.70'
server.listen(port, ip, () => {
  console.log(`HTTP server listening on ${ip}:${port}`);
});
/*
fetch('http://your_server_ip:3000/print', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({ text: 'Hello, thermal printer!' }),
})
.then((response) => response.json())
.then((data) => console.log(data))
.catch((error) => console.error('Error:', error));
*/
