import mysql = require("mysql2");

const dbConfig = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "change-me",
    DB: "STICKERSWF"
}

const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});


connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

export default connection;