const express = require('express');
const bodyParser = require('body-parser');
const ThermalPrinter = require('node-thermal-printer').printer;
const PrinterTypes = require('node-thermal-printer').types;

const app = express();
app.use(bodyParser.json());

app.post('/print', async (req, res) => {
  try {
    const message = req.body.message;

    let printer = new ThermalPrinter({
      type: PrinterTypes.EPSON, // Or other suitable type. Many are compatible.
      interface: 'tcp://192.168.177.128:9100', // Or your interface.
      characterSet: 'SLOVENIA', // Or your character set.
      removeSpecialCharacters: false,
      lineCharacter: '=',
      options: {
        timeout: 5000,
      },
    });

    const isConnected = await printer.isPrinterConnected();
    if (!isConnected) {
      return res.status(500).send('Printer not connected.');
    }

    printer.alignCenter();
    printer.println(message);
    //using the cut command from the library.
    printer.cut();

    await printer.execute();
    res.send('Printed successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error printing: ' + error.message);
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});