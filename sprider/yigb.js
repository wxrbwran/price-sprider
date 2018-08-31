// 获取区域房源信息
const Crawler = require('crawler');
const fs = require('fs')
const path = require('path')
const readline = require('readline');

// const readLine = () => {
//   const uris = []
//   const rl = readline.createInterface({
//     input: fs.createReadStream(path.resolve(__dirname, './source/yiye.txt'))
//   });
//   rl.on('line', (line) => {
//     console.log('Line from file:', line);
//     uris.push(line);
//   });
//   rl.on('end', () => {
//     console.log('end');
//   });
//   return uris;
// }

const lists = `http://t66y.com/htm_data/7/1806/3195413.html
http://t66y.com/htm_data/7/1806/3192652.html
http://t66y.com/htm_data/7/1806/3190558.html
http://t66y.com/htm_data/7/1806/3189341.html
http://t66y.com/htm_data/7/1806/3185991.html
http://t66y.com/htm_data/7/1806/3183157.html
http://t66y.com/htm_data/7/1806/3181471.html
http://t66y.com/htm_data/7/1806/3179101.html
http://t66y.com/htm_data/7/1806/3177231.html
http://t66y.com/htm_data/7/1806/3174555.html
http://t66y.com/htm_data/7/1806/3172798.html
http://t66y.com/htm_data/7/1806/3169726.html
http://t66y.com/htm_data/7/1806/3168022.html
http://t66y.com/htm_data/7/1806/3165312.html
http://t66y.com/htm_data/7/1806/3163556.html
http://t66y.com/htm_data/7/1805/3160618.html
http://t66y.com/htm_data/7/1805/3158924.html
http://t66y.com/htm_data/7/1805/3155921.html
http://t66y.com/htm_data/7/1805/3154561.html
http://t66y.com/htm_data/7/1805/3151534.html
http://t66y.com/htm_data/7/1805/3149887.html
http://t66y.com/htm_data/7/1805/3146995.html
http://t66y.com/htm_data/7/1805/3145322.html
http://t66y.com/htm_data/7/1805/3142531.html
http://t66y.com/htm_data/7/1805/3140610.html
http://t66y.com/htm_data/7/1807/3225843.html
http://t66y.com/htm_data/7/1807/3223143.html
http://t66y.com/htm_data/7/1807/3221544.html
http://t66y.com/htm_data/7/1807/3219187.html
http://t66y.com/htm_data/7/1807/3217123.html
http://t66y.com/htm_data/7/1807/3214281.html
http://t66y.com/htm_data/7/1807/3212660.html
http://t66y.com/htm_data/7/1807/3210391.html
http://t66y.com/htm_data/7/1807/3208299.html
http://t66y.com/htm_data/7/1807/3206285.html
http://t66y.com/htm_data/7/1807/3202388.html
http://t66y.com/htm_data/7/1807/3199534.html
http://t66y.com/htm_data/7/1807/3196757.html
http://t66y.com/htm_data/7/1804/3103967.html
http://t66y.com/htm_data/7/1804/3105576.html
http://t66y.com/htm_data/7/1804/3107476.html
http://t66y.com/htm_data/7/1804/3109932.html
http://t66y.com/htm_data/7/1804/3112279.html
http://t66y.com/htm_data/7/1804/3114594.html
http://t66y.com/htm_data/7/1804/3116417.html
http://t66y.com/htm_data/7/1804/3119186.html
http://t66y.com/htm_data/7/1804/3120863.html
http://t66y.com/htm_data/7/1804/3124061.html
http://t66y.com/htm_data/7/1804/3125423.html
http://t66y.com/htm_data/7/1805/3127908.html
http://t66y.com/htm_data/7/1805/3129733.html
http://t66y.com/htm_data/7/1805/3132121.html
http://t66y.com/htm_data/7/1805/3133800.html
http://t66y.com/htm_data/7/1805/3136580.html
http://t66y.com/htm_data/7/1805/3139610.html`;

const getLists = async () => {
  const uris = lists.replace(/\s/g, '').split('http://').filter(uri => !!uri).map(i => `http://${i}`);
  console.log(uris);
  // const uri = 'http://t66y.com/htm_data/7/1807/3225843.html'

  for (const uri of uris) {
    const priceCrawler = new Crawler({
      rateLimit: 5000,
      forceUTF8: true,
      incomingEncoding: 'gbk',
      callback (err, res, done) {
        // console.log(err, res, done);
        if (err) {
          console.log(err)
        } else {
          console.log(res);
          fs.writeFileSync(path.resolve(__dirname, `./data/json/list`), JSON.stringify(res));
          const $ = res.$
          let urls = {}
          const pageTitle = $('title').text().split(' - 技術討論區')[0]
          const text = $('.tpc_content.do_not_catch').text()
          const pairs = text.split(pageTitle)[1] ? text.split(pageTitle)[1].split('.html') : text.split('.html')
          urls.content = []
          urls.title = pageTitle
          for (const pair of pairs) {
            const tmp = {}
            const item = pair.split('https://')
            if (!!item[1]) {
              tmp.title = item[0].split(/(下载|下載|【下载|【下載)/)[0].trim()
              tmp.url = `${item[1]}.html`
              urls.content.push(tmp)
            }
          }
          urls.text = text
          fs.writeFileSync(path.resolve(__dirname, `./data/json/${pageTitle}.json`),
            JSON.stringify(urls, null, 2))
          console.log(`爬取结束，data length: ${urls.content.length}`)
        }
      }
    });
    priceCrawler.queue(uri)
  }
}

module.exports = { getLists };

getLists();
