const http = require('http');
const ThermalPrinter = require('node-thermal-printer').printer;
const PrinterTypes = require('node-thermal-printer').types;

const Jimp = require("jimp");

// const sharp = require("sharp");
// const fs = require("fs").promises; // Use promises for async file operations


const server = http.createServer(async (req, res) => {
  // console.log(res)
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or specify your origin
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS')
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/print') {
    console.log('/print')
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const message = data.message;
        console.log(data,message)

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

        // printer.alignCenter();
        // printer.println(message);
        // printer.cut();

        // await printer.printImage('./POS_printer_server/image2.png');
        // await printer.execute();

        const image = await Jimp.read('./POS_printer_server/image2.png');
        // Optional: Resize the image to fit the printer's width
        const printerWidth = 576; // Example: 576 dots for 72mm width. Adjust as needed.
        image.resize(printerWidth, Jimp.AUTO);
        // Optional: Convert to grayscale or black and white for better thermal printing
        image.grayscale(); // or image.threshold(128);
        await printer.printImage(image.bitmap.data);
        await printer.execute();

        // // Load the image using Sharp
        // const imageBuffer = await fs.readFile(imagePath);
        // const image = sharp(imageBuffer);

        // // Get metadata of the image
        // const metadata = await image.metadata();

        // // Resize the image to fit the printer's width
        // const printerWidth = 576; // Adjust as needed
        // const resizedImage = await image
        //   .resize(printerWidth, null, { withoutEnlargement: true })
        //   .grayscale() // Convert to grayscale
        //   .raw() // Get raw pixel data
        //   .toBuffer();
        // // Convert raw pixel data to a format usable by node-thermal-printer.
        // // Sharp provides a buffer of grayscale values (0-255). We need to
        // // convert these to a bitmap format that node-thermal-printer accepts.
        // const imageWidth = Math.min(printerWidth, metadata.width); //use the smaller width.
        // const bitmap = [];
        // for (let i = 0; i < resizedImage.length; i++) {
        //     bitmap.push(resizedImage[i]);
        // }
        // await printer.printImage(bitmap, imageWidth);
        // await printer.cut();
        // await printer.execute();

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
  console.log(`Server listening on port http://localhost:${port}`);
});