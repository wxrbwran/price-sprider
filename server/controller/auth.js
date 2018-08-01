const crypto = require('crypto');
const { knex} = require('../config/db');

knex.schema.withSchema('web_fx').createTableIfNotExists('users', function(table) {
    table.increments();
    table.text('username').notNull();
    table.text('password').notNull();
    table.timestamp('created_time').defaultTo(knex.fn.now());
}).asCallback(() => {
    console.log('table users has created!');
});

const SALT = 'yixin';
const SECRET = 'admin';

module.exports = {
    login: async (ctx) => {
        try {
            const { username, password } = ctx.request.body;
            const hmac = crypto.createHmac('sha256', SECRET);
            hmac.update(`${password}${SALT}`);
            const cryptoPassword =hmac.digest('hex');
            const result = await knex('users')
                .count('username')
                .where({
                   username,
                   password:  cryptoPassword
                })
                .first();
            if (+result.count > 0) {
                return ctx.body = {
                    status: 'success',
                    data: null,
                };
            } else {
                return ctx.body = {
                    status: 'fail',
                    data: '用户名或密码错误，请重新输入',
                };
            }
        } catch (e) {
            return ctx.body = {
                status: 'fail',
                data: e.stack,
            };
        }
    },
};
