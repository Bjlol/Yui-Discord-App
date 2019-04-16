const Sequelize = require('sequelize');

const database = new Sequelize(process.env.DatabaseLogin, process.env.DatabaseLogin, process.env.DatabasePassword, {
	host: process.env.DatabaseServer,
	dialect: 'mysql',
	logging: false,
});

module.exports = database;