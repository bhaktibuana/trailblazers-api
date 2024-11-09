const mysql2 = require('mysql2');
require('dotenv').config();

module.exports = {
	host: process.env.MAIN_MYSQL_DB_HOST || '',
	username: process.env.MAIN_MYSQL_DB_USER || '',
	password: process.env.MAIN_MYSQL_DB_PASSWORD || '',
	database: process.env.MAIN_MYSQL_DB_NAME || '',
	port: parseInt(process.env.MAIN_MYSQL_DB_PORT || ''),
	dialect: 'mysql',
	dialectModule: mysql2,
};
