const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('koa2-cors');
const compress = require('koa-compress');

// const whitelist = ['https://xinzhili.cn','https://feadmin.xzlcorp.com'];
module.exports = (app) => {
    // error handler
    onerror(app);
    // middlewares
    app.use(bodyparser({
        enableTypes: ['json', 'form', 'text'],
    }));
    app.use(cors({
        origin: function(ctx){
            return ctx.get('Origin');
        },
        credentials: true,
        allowMethods: ['GET', 'POST', 'DELETE', 'PATCH'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    }));
    app.use(compress({
        // filter: function (content_type) {
        //     console.log(content_type);
        //     return /text/i.test(content_type);
        // },
        threshold: 2048,
        flush: require('zlib').Z_SYNC_FLUSH
    }));
    app.use(json());
    app.use(logger());
    app.use(require('koa-static')(__dirname + '/../public'));
    app.use(views(__dirname + '/../public'));

    // logger
    app.use(async (ctx, next) => {
        const start = new Date();
        await next();
        const ms = new Date() - start;
        console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
    });
};
