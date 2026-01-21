const { Server } = require("socket.io");
const { pub, sub } = require("./redis");
const { produceMessage } = require("./kafka");


const initSocket = (httpServer) => {
    sub.subscribe("CHAT", (err, count) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Subscribed to chat channel. Number of subscribers: ${count}`);
        }
    });
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
        },
    });

    io.on('connect', (socket) => {
        console.log('a user connected', socket.id);
        socket.on('message', async (msg) => {
            console.log('a user message', msg);
            await pub.publish("CHAT", msg);
            await produceMessage(msg);
        })

        socket.on('disconnect', () => { 
            console.log('a user disconnected', socket.id);
        })
    });

    sub.on("message", (channel, message) => {
        console.log(`Received message on channel ${channel}: ${message}`);
        io.emit("message", message);
    });
}

module.exports = { initSocket };