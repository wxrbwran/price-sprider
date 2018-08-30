// 获取区域信息
const Crawler = require('crawler');
const fs = require('fs')
const path = require('path')

const getArea = async () => {
  const uri = 'https://dz.fang.anjuke.com/loupan/all/';
  console.log(`正在爬取${uri}`)
  const price_crawler = new Crawler({
    callback(err, res, done){
      console.log(err, res, done);
      if (err) {
        console.log(err);
      } else {
        const $ = res.$;
        const area = [];
        $('.filter-position .item-area .filter').eq(0).find('a').each(function () {
          const link = $(this).attr('href')
          const short = link.split('/').slice(-2)[0];
          const text = $(this).text()
          area.push({ link, short, text })
        })
        fs.writeFileSync(path.resolve(__dirname, './data/json/area.json'),
          JSON.stringify(area, null, 2), 'utf-8')
        console.log(`爬取结束，area length: ${area.length}`)
      }
    }
  });
  price_crawler.queue(uri);
};
// module.exports= {
//   getArea,
// }
getArea();
