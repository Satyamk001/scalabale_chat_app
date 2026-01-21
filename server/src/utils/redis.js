const Redis = require("ioredis");
const dotenv = require("dotenv");
dotenv.config();
const redisConfig = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
}

const pub = new Redis(redisConfig);
const sub = new Redis(redisConfig);

module.exports = { pub, sub };