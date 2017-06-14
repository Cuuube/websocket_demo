class Client {
    constructor(ws) {
        this.ws = ws;
        this.clientInfo = new ClientInfo({
            name: new RandomName().create(),
        })
        this.messageManager = new MessageManager(this);
        //this.name = Math.floor(10 * Math.random());
        this.bind();
        this.bindHander();
    }
    getName(id = 'ws-name') {
        return document.getElementById(id).value;
    }
    getMessage(id = 'ws-message') {
        return document.getElementById(id).value;
    }
    bindHander(sendBtnId = 'ws-send-message', closeBtnId = 'ws-close') {
        document.getElementById(sendBtnId).addEventListener('click', (e) => {
            let data = {
                code: 1,
                body: {
                    message: this.getMessage(),
                }
                
            }
            this.messageManager.sendMessage(data);
        });
        document.getElementById(closeBtnId).addEventListener('click', () => {
            this.ws.close();
        });
    }
    bind() {
        let ws = this.ws;
        ws.onopen = (e) => {
            console.log('opened!');
        }
        ws.onmessage = (e) => {
            this.messageManager.analyze(e.data)
        }
        ws.onclose = (e) => {
            console.log('closed!')
        }
        return ws;
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


class MessageManager {
    constructor(client) {
        this.ws = client.ws;
        this.clientInfo = client.clientInfo;
    }
    analyze(message) {
        message = JSON.parse(message);
        switch (message.code){
            case 0:
                let data = {
                    code: 0,
                    body: this.clientInfo
                };
                this.sendMessage(data);
                break;
            case 2:
                break;
            default:
                this.ws.renderData(message.body);
        }
    }
    sendMessage(data) {
        let _data = JSON.stringify(data);
        this.ws.send(_data);
    }
}
class ClientInfo {
    constructor(config) {
        this.name = config.name;
        this.description = config.description || 'none';
    }
}
class RandomName {
    constructor(nameDic) {
        let personNames = {
            '0': 'Joan Joule',
            '1': 'Andy Partridge',
            '2': 'Bill Wilson',
            '3': 'Nelly Ferguson',
            '4': 'Maria Hubbard',
            '5': 'Truman Jackson',
            '6': 'Evan Ezekiel',
            '7': 'Primo Walton',
            '8': 'Chloe Tommy',
            '9': 'Winston Camp'
        }
        this.nameList = nameDic || personNames;
    }
    create() {
        return this.nameList[Math.floor(10 * Math.random())];
    }
}

new Client(new MyWs('ws://0.0.0.0:3456', 'echo-protocol'));


// function createtimer() {
//     var month = {
//         '0': 'January',
//         '1': 'February',
//         '2': 'March',
//         '3': 'April',
//         '4': 'May',
//         '5': 'June',
//         '6': 'July',
//         '7': 'August',
//         '8': 'September',
//         '9': 'October',
//         '10': 'November',
//         '11': 'December',
//     }
//     var time = new Date();
//     var str = month[time.getMonth()] + ' ' + time.getDay() + ', ' + time.getFullYear();
//     return str;
// }
//-----------------------

class PersonInfoCreater {
    constructor(config) {
        this.config = config;
    }
    getRandomFromList(list) {
        return list[Math.floor(Math.random()*list.length)];
    }
    createNumber(min, max) {
        return Math.round(Math.random()*(max-min)+min);
    }
    createName() {
        const nameList = [];
        return this.getRandomFromList(nameList);
    }
    createAge(yearsold, max) {
        let age;
        yearsold = yearsold || 0;
        max = max || 100;
        switch (yearsold) {
            case 'old':
                age = createNumber(60,99);
                break;
            case 'adult':
                age = createNumber(35,60);
                break;
            case 'young':
                age = createNumber(15,35)
                break;
            case 'child':
                age = createNumber(0, 15)
                break; 
            default:
                age = createNumber(yearsold, max);
        }
        return age;
    }
    createExperience(name) {
        name = name || this.createName();
        const getOne = this.getRandomFromList;
        const prepositionList = ['喜欢', '讨厌', '经常', '偶尔', '最受不了', '超爱', '离不了', '三天一次', '一周十次', '每天都', '发疯般地爱上', '哈哈大笑地', '从不屑于', '曾经'];
        const locationList = ['家', '学校', '三年前', '两个月前', '刚才', '电影院', '白宫门口', '纽约', '背景', '伦敦', '公司楼梯', '梦里', '领导致辞间', '理发馆', '打牌时', '聚会中', '毕业时', '床上', '人民公园', '陆家嘴','五道口', '咖啡店']
        const doWhatList = ['打喷嚏', '吃冰淇淋', '放P', '撒酒疯', '看表演', '打游戏', '玩手机', '睡懒觉', '偷吃', '大便', '假装开车', '原地踏步', '做操', '大声喧哗', '说苟...', '做好事', '摩擦头皮']
        const verbList = [];
        const nounList = [];
        const str = `${getOne(prepositionList)}在${getOne(locationList)}${getOne(doWhatList)}`
        return str;
    }
    
    create() {
        let info = {
            name: config.name || this.createName(),
            age: config.name || this.createAge(),
            experience: createExperience(),
        }
        return info;
    }
}