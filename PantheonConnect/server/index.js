const express = require('express');
const path = require('path');

const app = express();
const {spawn} = require('child_process');
const WebSocket = require('ws');

const fs = require('fs');


const http = require('http');

const pythonExecutable = 'mypienv/bin/python';
const python = spawn(pythonExecutable, ['processing.py']);


python.on('close', (code) => {
    // Handle Python process close event
    // You may want to handle this depending on your requirements
});

python.stderr.on('data', function (data) {
    console.error('Error from python script:', data.toString());
});

const publicPath = path.join(__dirname, '..', 'client');
app.use(express.static(publicPath, { index: 'index.html' }));

app.get('/record', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'test.html'));
})

const PORT = process.env.PORT || 3000;
const httpServer = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
const wss = new WebSocket.Server({ server: httpServer });


wss.on('connection', function connection(ws) {
    // console.log('WebSocket connection established');

    ws.on('message', function incoming(message) {
        // console.log('Received video data:', message);
        // MESSAGE IS BASE 64 ENCODED JPEG
        message = message.toString();
        
        // console.log(message+"\n\n\n");
        // const buffer = Buffer.from(message.Body).toString('base64');        
        
        // const imageData = message.replace(/^data:image\/jpeg;base64,/, '');
        // const mimeType = 'image/jpg'; 
        
        // console.log("Image Saved");
        // fs.writeFileSync('received_image.jpg', buffer);


        // console.log(message.substring(0,100))
        // console.log(message.length)
        python.stdin.write(message.trim()+"\n"); 

        // var dataToSend;
        // python.stdout.on('data', function (data) {
        //     dataToSend = data.toString();
        //     // console.log(new Date().getTime())
        //     ws.send(dataToSend);
        // });
        
    });

    ws.on('close', function() {
        // console.log('WebSocket connection closed');
    });
});

python.stdout.on('data', function (data) {
    const dataToSend = data.toString();
    // Send the data to WebSocket clients
    wss.clients.forEach(client => {
        // console.log(dataToSend)
        
        // if (isPrinted<3){
        //     console.log(dataToSend);
        //     isPrinted+=1;
        // }
        client.send(dataToSend);
    });
});