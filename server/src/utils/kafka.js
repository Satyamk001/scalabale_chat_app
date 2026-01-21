const { Kafka } = require("kafkajs");
const fs = require("fs");
const { pool } = require("../config/dbConfig");
const dotenv = require("dotenv");

dotenv.config();
const kafka = new Kafka({
    brokers: [process.env.KAFKA_BROKERS],
    ssl: {
        ca: [fs.readFileSync("ca.pem")]
    },
    sasl: {
        mechanism: "plain",
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD
    }
});

let producer = null;
let consumer = null;

const initKafka = async () => {
    try {
        producer = kafka.producer();
        consumer = kafka.consumer({ groupId: "chat-app" });
        await producer.connect();
        await consumer.connect();
        await consumer.subscribe({ topic: "CHAT", fromBeginning: true });
        console.log("Kafka connected");
    } catch (error) {
        console.log(error);
    }
}

const produceMessage = async (message) => {
    if (!producer) await initKafka();
    await producer.send({
        topic: "CHAT",
        messages: [
            { value: message },
        ],
    });
}

const consumeMessage = async () => {
    if (!consumer || !producer) await initKafka();
    console.log("Kafka consumer started");
    await consumer.run({
        eachMessage: async ({ message, pause }) => {
            // console.log(`Received message: ${message.value}`);
            try {
                await pool.query(`INSERT INTO scalable_chat (message) VALUES ($1)`, [message.value]);
            } catch (error) {
                console.log(error);
                pause();
                setTimeout(() => {
                    consumer.resume([{ topic: "CHAT" }]);
                }, 60 * 1000);
            }
        },
    });
}

module.exports = { initKafka, produceMessage, consumeMessage }; 