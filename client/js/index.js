class Client {
    constructor(ws) {
        this.ws = ws;
        this.name = Math.floor(10 * Math.random());
        this.bindHander();
    }
    sendMessage(value) {
        let data = {
            name: this.name,
            message: value,
        }
        let _data = JSON.stringify(data);
        this.ws.send(_data);
    }
    bindHander() {
        document.getElementsByTagName('button')[0].onclick = () => {
            const value = document.getElementsByTagName('input')[0].value;
            this.sendMessage(value);
        }
        document.getElementsByTagName('button')[1].onclick = () => {
            this.ws.close();
        }
        document.getElementsByTagName('button')[2].onclick = () => {
            alert('暂无');
        }
    }
}
class MyWs extends WebSocket {
    constructor(wsURL, signal) {
        super(wsURL, signal);
    }
    print(str, id = 'print') {
        const oldStr = document.getElementById(id).innerHTML;
        document.getElementById(id).innerHTML = oldStr + '<br/>' + str;
    }
    renderData(data) {
        this.print(data.name + ': ' + data.message);
    }
}
class WsFactory {
    constructor(wsURL, signal) {
        this.ws = new MyWs(wsURL, signal);
    }
    bind() {
        let ws = this.ws;
        ws.onopen = (e) => {
            console.log('opened!');
        }
        ws.onmessage = (e) => {
            let _data = JSON.parse(e.data);
            console.log('message: ' + e.data);
            ws.renderData(_data);
            //sendMessage(e.data * 2);
        }
        ws.onclose = (e) => {
            console.log('closed!')
        }
        return ws;
    }
}

new Client(new WsFactory('ws://0.0.0.0:3456', 'echo-protocol').bind());