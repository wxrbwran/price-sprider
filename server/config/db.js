const proConfig = {
    host: 'dev.cuauwtxtbfew.rds.cn-north-1.amazonaws.com.cn',
    user: 'daqiang',
    password: '(LiHengShaui123)',
    database: 'postgres'
};

const devConfig = {
    host: '172.16.10.8',
    user: 'test',
    password: 'qingfei775',
    database: 'web'
};

const knex = require('knex')({
    client: 'pg',
    searchPath: 'web_fx',
    connection: process.env.NODE_ENV === 'production' ? proConfig : devConfig,
    acquireConnectionTimeout: 10000
});

module.exports = {
    knex
};
