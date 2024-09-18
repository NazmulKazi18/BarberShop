const knex = require('knex')
const dbConnection = knex({
  client: 'sqlite3',
  connection: {
    filename: 'bd.sqlite3'
  },
  useNullAsDefault: true
})
module.exports = dbConnection