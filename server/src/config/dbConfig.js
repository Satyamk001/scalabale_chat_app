const { Pool } = require("pg");
require("dotenv").config();
const pool = new Pool({
    connectionString: process.env.DB_URL
});

const connectDB = async () => {
    try {
        await pool.connect();
        console.log("Database connected");
        // const res = await pool.query(`Select * from scalable_chat`);
        // console.log(res.rows);
    } catch (error) {
        throw error;
    }
}

module.exports = { pool, connectDB };