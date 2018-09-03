const Koa = require('koa');
const app = new Koa();
const middleware = require('./middleware');

middleware(app);

// routes
const index = require('./routes/index');
const api = require('./routes/api');
const upload = require('./routes/upload');

app.use(index.routes(), index.allowedMethods());
app.use(api.routes(), api.allowedMethods());
app.use(upload.routes(), upload.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx);
});

module.exports = app;
