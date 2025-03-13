const escpos = require('escpos');
escpos.Network = require('escpos-network');
// const { ReceiptPrinterEncoder } = require('escpos');
const { ReceiptPrinterEncoder } = require('receiptline');
console.log(ReceiptPrinterEncoder)


const PRINTER_IP = "192.168.177.128"; // Change this to your printer's IP
const PRINTER_PORT = 9100; // Most ESC/POS network printers use port 9100

// Create a network device
const device = new escpos.Network(PRINTER_IP, PRINTER_PORT);

// Initialize printer
const printer = new escpos.Printer(device);

// Create encoder
const encoder = new ReceiptPrinterEncoder();
encoder.initialize();
encoder.text("Hello, World!");
encoder.newline();
encoder.bold(true);
encoder.text("Bold Text Example");
encoder.bold(false);
encoder.newline();
encoder.align('center');
encoder.text("Center Aligned Text");
encoder.newline();
encoder.cut();

const encodedData = encoder.encode();

console.log(encodedData)

// Send data to the printer
device.open(() => {
  printer.raw(encodedData);
  printer.cut();
  printer.close();
});
