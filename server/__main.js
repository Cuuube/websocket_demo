const WebSocketServer = require('websocket').server;
const http = require('http');

const chatData = {data:[]};
class ChatMessage {
    constructor (name, message) {
        this.name = name;
        this.message = message;
    }
}

const events = require('events');
const ev = new events.EventEmitter();//实例化事件
//let connections = [];
// 使用wsServer.connetions代替自己创建connections数组
// ev.on('addConnections', (connection) => {
//     connections.push(connection);  
// })
// ev.on('closeConnections', (connection) => {
//     connections = connections.filter((val) => val != connection);
// })
// ev.on('sendData',(data) => {
//     const _chatData = JSON.stringify(chatData);
//     data.forEach((val) => {
//         val.sendUTF(_chatData);
//     })
//     //console.log('消息已传给：'+data.length+'人');
// })
ev.on('resived', (data) => {
    chatData.data.push(new ChatMessage(data.name, data.message));
    //ev.emit('sendData');
    const _chatData = JSON.stringify(chatData);
    boardcast(_chatData);
})

const server = http.createServer((req, res) => {
    console.log(`${new Date()} Receved request for ${req.url}`);
    res.writeHead(404);
    res.end();
});

server.listen(require('./config.js').port, () => {
    console.log((new Date()) + ' Server is listening on port 3456');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnetions: false,
});

wsServer.on('request', (req) => {
    const connection = req.accept('echo-protocol', req.origin);
    console.log(`"${req.origin}" 连接成功`);
    //ev.emit('addConnections', connection);
    console.log('房间中共有：'+ wsServer.connections.length +'人');
    connection.on('message', (message) => {
        if (message.type === 'utf8') {
            let resivedData = JSON.parse(message.utf8Data);
            console.log(`Received Message from ${req.origin}: "${message.utf8Data}"`);
            //connection.sendUTF(message.utf8Data);
            //timesTwo(message.utf8Data, connection);
            ev.emit('resived', resivedData);
        }
        // else if (message.type === 'binary') {
        //     console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        //     connection.sendBytes(message.binaryData);
        // }
    });

    connection.on('close', function(reasonCode, description) {
        //ev.emit('closeConnections', connection);
        console.log(connection.remoteAddress + ' disconnected.');
        console.log('房间还剩下：'+ wsServer.connections.length +'人');
        
    });
})

const timesTwo = function (number, connection) {
    connection.sendUTF(number * 2);
}

const boardcast = function (message) {
    wsServer.connections.forEach((connection) => {
        connection.sendUTF(message);
    })
}