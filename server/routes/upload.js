const router = require('koa-router')();
const uploadController = require('../controller/upload');

router.prefix('/upload');

router.post('/img', uploadController.uploadImg);

module.exports = router;
