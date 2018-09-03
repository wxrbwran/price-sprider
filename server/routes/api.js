const router = require('koa-router')();
const newsController = require('../controller/news');
const positionController = require('../controller/position');
const _91Controller = require('../controller/91data');

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

// crawler
router.post('/91data/handleYYBF', _91Controller.handleYYBF);
router.post('/91data/downloadFile', _91Controller.downloadFile);
router.post('/91data/crawlYifileFileLink', _91Controller.crawlYifileFileLink);

router.get('/91data/getAllTitles', _91Controller.getAllTitles);
router.get('/91data/getSelectionParams', _91Controller.getSelectionParams);
router.get('/91data/getDistinctSeasonByMonth', _91Controller.getDistinctSeasonByMonth);
router.post('/91data/editTitleStatusById', _91Controller.editTitleStatusById);

module.exports = router;
