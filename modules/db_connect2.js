const mysql = require("mysql2")

const pool = mysql.createPool({
	host: process.env.DB_HOST || "localhost",
	user: process.env.DB_USER || "root",
	password: process.env.DB_PASS || "",
	database: process.env.DB_NAME || "timetraveathome",
	waitForConnections: true,
	queueLimit: 0,
	connectionLimit: 10,
	port:3306
}) 

module.exports = pool.promise()
