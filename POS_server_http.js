const http = require('http');
// const ThermalPrinter = require('node-thermal-printer').printer;
// const PrinterTypes = require('node-thermal-printer').types;

// const Jimp = require("jimp");

// const sharp = require("sharp");
// const fs = require("fs").promises; // Use promises for async file operations

const fs = require('fs').promises;

// const fetch = require('fetch')
// console.log(fetch)

const escpos = require('escpos');
// Install network adapter
escpos.Network = require('escpos-network');


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
        const textToPrint = data.message;
        const imagePath=data.imagePath;
        console.log(textToPrint,imagePath)

        let PRINTER_IP='192.168.1.70'
        let PRINTER_PORT=9100
        const device = new escpos.Network(PRINTER_IP, PRINTER_PORT);
        const printer = new escpos.Printer(device);

        device.open(error => {
            if (error) {
                console.error('Error opening printer:', error);
                socket.end();
                return;
            }

            printer
                .font('a')
                .align('ct')
                .style('bu')
                .size(1, 1)
                .text(textToPrint)
                .feed(2)
                .cut()
                .close();

            console.log('Text sent to printer:', textToPrint);
            socket.end(); // Close the socket after printing.
        });

        // let printer = new ThermalPrinter({
        //   type: PrinterTypes.EPSON,
        //   interface: 'tcp://192.168.177.128:9100',
        //   characterSet: 'SLOVENIA',
        //   removeSpecialCharacters: false,
        //   lineCharacter: '=',
        //   options: {
        //     timeout: 5000,
        //   },
        // });
        // const isConnected = await printer.isPrinterConnected();
        // if (!isConnected) {
        //   res.writeHead(500, { 'Content-Type': 'text/plain' });
        //   res.end('Printer not connected.');
        //   return;
        // }

        // printer.alignCenter();
        // printer.println(message);
        // printer.cut();

        // await printer.printImage('./POS_printer_server/image2.png');
        // await printer.execute();


        // // const image = await Jimp.read('./POS_printer_server/image2.png');
        // const imageBuffer = await fs.readFile('./POS_printer_server/image2.png');
        // const image = await Jimp.Jimp.read(imageBuffer);

        // // Optional: Resize the image to fit the printer's width
        // const printerWidth = 576; // Example: 576 dots for 72mm width. Adjust as needed.
        // image.resize(printerWidth, Jimp.AUTO);
        // // Optional: Convert to grayscale or black and white for better thermal printing
        // image.grayscale(); // or image.threshold(128);
        // await printer.printImage(image.bitmap.data);
        // await printer.execute();

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

        // await printer.printImage('./POS_printer_server/image3.png');  // Print PNG image
        // await printer.execute();

        // try {
        //   // Replace with your printer's IP address and image path
        //   await printImageToNetworkPrinter(
        //     // '192.168.177.90', 
        //     '192.168.1.70',
        //     9100, 
        //     // './POS_printer_server/image3.png',
        //     imagePath
        //   );
        //   console.log('Print job submitted successfully');
        // } catch (error) {
        //   console.error('Failed to print:', error);
        // }

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

/**
 * Function to print an image to a network ESC/POS printer
 * @param {string} printerIP - The IP address of the printer
 * @param {number} port - The port number (usually 9100)
 * @param {string} imagePath - Path to the PNG or JPG image
 * @param {string} density - Image density (s8, d8, s24, d24)
 * @returns {Promise} - Resolves when printing is complete
 */
function printImageToNetworkPrinter(printerIP, port, imagePath, density = 'd24') { console.log(printerIP,port,imagePath,density)
  return new Promise((resolve, reject) => {
    try {
      // Create network device
      const device = new escpos.Network(printerIP, port);
      // Create printer interface
      const printer = new escpos.Printer(device);

      // const networkDevice = new escpos.Network('localhost');
      // const networkScreen = new escpos.Screen(networkDevice);

      console.log(`Connecting to printer at ${printerIP}:${port}...`);
      
      // Open connection to the printer
      device.open(function(err) {
        if (err) {
          console.error('Error opening connection to printer:', err);
          return reject(err);
        }

        console.log('Connected to printer. Loading image...');

        // device.open(function(error){
          printer
          .font('a')
          .align('ct')
          .style('bu')
          .size(1, 1)
          .text('The quick brown fox jumps over the lazy dog')
          // .text('敏捷的棕色狐狸跳过懒狗')
          // .barcode('1234567', 'EAN8')
          // .table(["One", "Two", "Three"])
          // .tableCustom(
          //   [
          //     { text:"Left", align:"LEFT", width:0.33, style: 'B' },
          //     { text:"Center", align:"CENTER", width:0.33},
          //     { text:"Right", align:"RIGHT", width:0.33 }
          //   ],
          //   { encoding: 'cp857', size: [1, 1] } // Optional
          // )
          // .qrimage('https://github.com/song940/node-escpos', function(err){
          //   this.cut();
          //   this.close();
          // });
        // });

        
      //   try{
      //   // Load the image (works with PNG or JPG)
      //   escpos.Image.load(imagePath, function(image) {
      //     console.log('Image loaded. Sending to printer...');
          
      //     printer
      //       .align('ct')         // Center align the image
      //       .image(image, density) // Print with specified density
      //       .then(() => {
      //         console.log('Image sent to printer. Finishing...');
              
      //         printer
      //           .cut()           // Cut the paper
      //           .close();        // Close the connection
              
      //         console.log('Print job completed successfully.');
      //         resolve('Print completed');
      //       })
      //       .catch(error => {
      //         console.error('Error printing image:', error);
      //         printer.close();
      //         reject(error);
      //       });
      //   })
      //   // .catch(error => {
      //   //   console.error('Error loading image:', error);
      //   //   device.close();
      //   //   reject(error);
      //   // });
      // }catch(error){
      //   console.error('Error loading image:', error);
      //   device.close();
      //   reject(error);
      // } 
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      reject(error);
    }
  });
}