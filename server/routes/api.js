const router = require('koa-router')();
const newsController = require('../controller/news');
const positionController = require('../controller/position');

router.prefix('/api/v0');

/* 新闻 */

router.get('/post_articles', newsController.getPostArticles);

router.post('/article', newsController.addArticle);

router.patch('/article/:id', newsController.editArticleById);

router.get('/all_articles', newsController.getAllArticles);

router.get('/article/:id', newsController.getArticleById);

router.delete('/article/:id', newsController.deleteArticleById);

/* 招聘 */
router.get('/post_positions', positionController.getPostPositions);

router.post('/position', positionController.addPosition);

router.patch('/position/:id', positionController.editPositionById);

router.get('/all_positions', positionController.getAllPositions);

router.get('/position/:id', positionController.getPositionById);

router.delete('/position/:id', positionController.deletePositionById);

module.exports = router;
