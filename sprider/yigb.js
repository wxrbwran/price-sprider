// 获取区域房源信息
const Crawler = require('crawler');
const fs = require('fs')
const path = require('path')

const getLists = async () => {
  const uri = 'http://t66y.com/htm_data/7/1807/3225843.html';
  console.log(`正在爬${uri}`)
  const price_crawler = new Crawler({
    rateLimit: 1000,
    forceUTF8: true,
    incomingEncoding: 'gbk',
    callback(err, res, done){
      // console.log(err, res, done);
      if (err) {
        console.log(err);
      } else {
        const $ = res.$;
        let urls = [];
        const text = $('.tpc_content.do_not_catch').text();
        console.log(text);
        console.log($('body').text());
        urls.push({ text })
        fs.writeFileSync(path.resolve(__dirname, './data/json/urls.json'),
          JSON.stringify(urls, null, 2))
        console.log(`爬取结束，text length: ${text.length}`)
      }
    }
  });
  price_crawler.queue({
    uri,
    proxy: 'http://222.92.194.153:80'
  });
}

module.exports = { getLists };

getLists();
