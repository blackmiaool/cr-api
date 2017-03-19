class Cr {
    constructor() {
        const socket = require('socket.io-client')('http://mdzzapp.com:3000/');
        this.socket = socket;

        socket.on('connect', function (socket) {
            console.log("on connect");
        });
        socket.on('event', function (data) {
            console.log('event', data);
        });
        socket.on('disconnect', function () {
            console.log("disconnect");
        });
        socket.on('newMessage', ({
            room,
            type,
            content
        }) => {
            if (!this.listeners[room]) {
                return;
            }
            const message = {
                type: type.match(/^(\w+)Message/)[1],
                content,
            }
            this.listeners[room].forEach(function (cb) {
                cb(message);
            });

        });
        Object.assign(this, {
            listeners: {}
        });
    }
    login(nickname, password) {
        return new Promise((resolve, reject) => {
            this.socket.emit("login", {
                nickname,
                password
            }, ({
                jwt,
                isError,
                errMsg
            }) => {
                if (isError) {
                    reject(errMsg);
                    return;
                }
                this.nickname = nickname;
                this.token = jwt;
                this.socket.emit("getInfo", {
                    token: jwt,
                    device: "PC"
                }, function () {
                    resolve();
                });

            });
        });
    }
    send(room, type, content) {
        this.socket.emit("message", {
            nickname: this.nickname,
            content,
            room,
            time: Date.now(),
            type: type + 'Message'
        });
    }
    join(roomName) {
        return new Promise((resolve, reject) => {
            this.socket.emit("joinRoom", {
                nickname: this.nickname,
                roomName,
                //            avatar: "http://cr.mdzzapp.com/images/expressions/喷.png"
            }, function ({
                ok,
                msg
            }) {
                if (ok) {
                    resolve();
                    return;
                } else {
                    reject();
                    return;
                }
            });
        });

    }
    listen(room, cb) {
        if (!this.listeners[room]) {
            this.listeners[room] = [];
        }
        this.listeners[room].push(cb);
    }
}
module.exports = Cr;
//var cr = new Cr();
//cr.login("name", "password").then(function () {
//    console.log("success");
//    cr.join("god");
//    cr.send("god", "text", "api test");
//    cr.listen("god", function (message) {
//        console.log("god", message);
//    });
//    cr.listen("fiora", function (message) {
//        console.log("fiora", message);
//    });
//
//}).catch(function (e) {
//    console.log(e);
//});
