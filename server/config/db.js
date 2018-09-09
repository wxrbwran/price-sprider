// const proConfig = {
//   host: '*',
//   user: '*',
//   password: '(*)',
//   database: 'postgres'
// };
//
// const devConfig = {
//   host: 'localhost',
//   user: 'wxr',
//   password: 'qingfei775',
//   database: 'postgres'
// };
//
// const knex = require('knex')({
//   client: 'pg',
//   searchPath: 'public',
//   connection: devConfig,
//   acquireConnectionTimeout: 10000
// });
//


const proConfig = {
  host: '123.206.90.112',
  user: 'wxr',
  password: 'qingfei775',
  database: '91data'
};

const devConfig = {
  host: 'localhost',
  user: 'wxr',
  password: 'qingfei775',
  database: 'postgres'
};

const knex = require('knex')({
  client: 'pg',
  searchPath: 'wxr',
  connection: proConfig,
  acquireConnectionTimeout: 10000
});

module.exports = {
    knex
};
