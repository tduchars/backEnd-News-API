const knex = require('knex');
const dbConfig = require('../knexfile');
console.log(dbConfig, '<---');
const connection = knex(dbConfig);

module.exports = connection;
