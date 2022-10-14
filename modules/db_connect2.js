const mysql = require("mysql2")

const pool = mysql.createPool({
	host: process.env.DB_HOST || "localhost",
	user: process.env.DB_USER || "root",
	password: process.env.DB_PASS || "",
	database: process.env.DB_NAME || "timetraveathome",
	waitForConnections: true,
	queueLimit: 0,
	connectionLimit: 10,
}) 

module.exports = pool.promise()
