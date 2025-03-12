const net = require('net');
const escpos = require('escpos');
escpos.Network = require('escpos-network');

const PRINTER_IP = '192.168.1.70'; // Replace with your printer's IP
const PRINTER_PORT = 9100; // Replace with your printer's port

const server = net.createServer((socket) => {
    console.log('Client connected.');

    socket.on('data', (data) => {
        const textToPrint = data.toString('utf8').trim(); // Convert buffer to string
        console.log(textToPrint)

        if (!textToPrint) {
            console.log('Received empty data.');
            socket.end();
            return;
        }

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
    });

    socket.on('end', () => {
        console.log('Client disconnected.');
    });

    socket.on('error', (err) => {
        console.error('Socket error:', err);
        socket.end();
    });
});

server.listen(PRINTER_PORT, () => { //Listen on a different port than the printer itself.
    console.log(`Server listening on port ${PRINTER_PORT}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

process.on('SIGINT', function() {
  console.log("Caught interrupt signal");
  server.close();
  process.exit();
});