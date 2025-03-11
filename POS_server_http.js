const http = require('http');
const ThermalPrinter = require('node-thermal-printer').printer;
const PrinterTypes = require('node-thermal-printer').types;

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/print') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const message = data.message;

        let printer = new ThermalPrinter({
          type: PrinterTypes.EPSON,
          interface: 'tcp://192.168.177.128:9100',
          characterSet: 'SLOVENIA',
          removeSpecialCharacters: false,
          lineCharacter: '=',
          options: {
            timeout: 5000,
          },
        });

        const isConnected = await printer.isPrinterConnected();
        if (!isConnected) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Printer not connected.');
          return;
        }

        printer.alignCenter();
        printer.println(message);
        printer.cut();

        await printer.execute();
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Printed successfully');
      } catch (error) {
        console.error('Error:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error printing: ' + error.message);
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});