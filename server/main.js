class Main {
    constructor() {
        class Message {
            constructor (code, body) {
                this.code = code;
                this.body = body;
            }
        }
        class MessageManager {
            constructor(connection) {
                this.connection = connection;
            }
            analyze(message) {
                switch (message.code){
                    case 0:
                        this.connection.client = message.body;
                        console.log(`"${message.body.name}" 连接成功`);
                        break;
                    case 2:
                        break;
                    default:
                        this.connection.boardcast(new Message(1,{
                            name: this.connection.client.name,
                            message: message.body.message,
                        }));
                }
            }
            requestClientInfo() {
                const data = JSON.stringify({
                    code: 0,
                });
                this.connection.sendUTF(data);
            }
        }

        const WebSocketServer = require('websocket').server;
        const http = require('http');


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

        wsServer.on('boardcast', function(message) {
            console.log(message);
            let _message = JSON.stringify(message);
            this.connections.forEach((connection) => {
                connection.sendUTF(_message);
            });
        })
        wsServer.on('request', (req) => {
            const connection = req.accept('echo-protocol', req.origin);
            connection.boardcast = (message) => {wsServer.emit('boardcast', message);}
            const msgmng = new MessageManager(connection);
            msgmng.requestClientInfo();
            console.log('房间中共有：'+ wsServer.connections.length +'人');

            connection.on('message', (message) => {
                if (message.type === 'utf8') {
                    console.log(`Received Message from ${req.origin}: "${message.utf8Data}"`);
                    message = JSON.parse(message.utf8Data);
                    msgmng.analyze(message);
                    //wsServer.emit('boardcast', message.utf8Data);
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

/**
 * 客户机与服务及交互的状态码：
 * 0: 首次连通时，客户机传回客户身份信息
 * 1: 正常通信交互
 * 2: 客户机改变身份
 */
