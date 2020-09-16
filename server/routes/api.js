const router = require('koa-router')();
const _91Controller = require('../controller/91data');

router.prefix('/api/v0');

// crawler
router.post('/91data/handleYYBF', _91Controller.handleYYBF);
router.post('/91data/downloadFile', _91Controller.downloadFile);
router.post('/91data/crawlYifileFileLink', _91Controller.crawlYifileFileLink);

router.get('/91data/getAllTitles', _91Controller.getAllTitles);
router.get('/91data/getSelectionParams', _91Controller.getSelectionParams);
router.get(
  '/91data/getDistinctSeasonByMonth',
  _91Controller.getDistinctSeasonByMonth,
);
router.post('/91data/editTitleStatusById', _91Controller.editTitleStatusById);

module.exports = router;
