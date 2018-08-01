const router = require('koa-router')();
const authController = require('../controller/auth');

router.prefix('/auth');

/* 登录 */

router.post('/login', authController.login);

module.exports = router;
