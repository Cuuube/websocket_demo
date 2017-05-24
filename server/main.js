class Main {
    constructor() {
        class ChatMessage {
            constructor (name, message) {
                this.name = name;
                this.message = message;
            }
        }
        class Boardcaster {
            send(message) {
                wsServer.connections.forEach((connection) => {
                    connection.sendUTF(message);
                });
            }
        }

        const WebSocketServer = require('websocket').server;
        const http = require('http');
        const events = require('events');

        const ev = new events.EventEmitter();
        const chatData = {data:[]};
        const boardcaster = new Boardcaster();

        ev.on('resived', (data) => {
            chatData.data.push(new ChatMessage(data.name, data.message));
            const _chatData = JSON.stringify(chatData);
            boardcaster.send(_chatData);
        })

        const server = http.createServer((req, res) => {
            console.log(`${new Date()} Receved request for ${req.url}`);
            res.writeHead(404);
            res.end();
        });
        server.listen(require('./config.js').port, () => {
            console.log((new Date()) + ' Server is listening on port 3456');
        });

        const wsServer = new WebSocketServer({
            httpServer: server,
            autoAcceptConnetions: false,
        });

        wsServer.on('request', (req) => {
            const connection = req.accept('echo-protocol', req.origin);
            console.log(`"${req.origin}" 连接成功`);
            console.log('房间中共有：'+ wsServer.connections.length +'人');

            connection.on('message', (message) => {
                if (message.type === 'utf8') {
                    let resivedData = JSON.parse(message.utf8Data);
                    console.log(`Received Message from ${req.origin}: "${message.utf8Data}"`);
                    ev.emit('resived', resivedData);
                }
            });

            connection.on('close', function(reasonCode, description) {
                console.log(connection.remoteAddress + ' disconnected.');
                console.log('房间还剩下：'+ wsServer.connections.length +'人');
            });
        })
    }
}

new Main();
