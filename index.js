class Cr {
    constructor() {
        const socket = require('socket.io-client')('http://mdzzapp.com:3000/');
        this.socket = socket;
        socket.on('connect', function () {
            console.log("on connect");
        });
        socket.on('event', function (data) {});
        socket.on('disconnect', function () {
            console.log("disconnect");
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
                resolve();
            });
        });
    }
    send(type, content) {
        this.socket.emit("message", {
            nickname: this.nickname,
            content,
            room: "fiora",
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
}
module.exports = Cr;
//var cr = new Cr();
//cr.login("name", "password").then(function () {
//    console.log("success");
//    cr.join("fiora");
//    cr.send("text", "api test");
//}).catch(function (e) {
//    console.log(e);
//});
