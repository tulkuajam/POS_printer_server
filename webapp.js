const net = require('net');

// Example usage of the net module
const client = net.createConnection({ port: 9100, host: '192.168.1.88' }, () => {
    console.log('connected to server!');
    client.write('world!\r\n');
});

client.on('data', (data) => {
    console.log(data.toString());
    client.end();
});

client.on('end', () => {
    console.log('disconnected from server');
});

client.on('error', (err) => {
    console.log(err);
})
