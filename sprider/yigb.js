// 获取区域房源信息
const Crawler = require('crawler');
const fs = require('fs')
const path = require('path')

const getLists = async () => {
  const uri = 'http://t66y.com/htm_data/7/1807/3225843.html'
  console.log(`正在爬${uri}`)
  const priceCrawler = new Crawler({
    rateLimit: 1000,
    forceUTF8: true,
    incomingEncoding: 'gbk',
    callback (err, res, done) {
      // console.log(err, res, done);
      if (err) {
        console.log(err)
      } else {
        const $ = res.$
        let urls = {}
        const pageTitle = $('title').text().split(' - 技術討論區')[0]
        const text = $('.tpc_content.do_not_catch').text()
        const pairs = text.split(pageTitle)[1].split('.html')
        urls.content = []
        urls.title = pageTitle
        for (const pair of pairs) {
          const tmp = {}
          const item = pair.split('https://')
          tmp.title = item[0].split(/(下载|下載|【下载|【下載)/)[0].trim()
          tmp.url = `${item[1]}.html`
          urls.content.push(tmp)
        }
        console.log($('body').text())
        urls.text = text
        fs.writeFileSync(path.resolve(__dirname, './data/json/urls.json'),
          JSON.stringify(urls, null, 2))
        console.log(`爬取结束，data length: ${urls.content.length}`)
      }
    }
  });
  priceCrawler.queue({
    uri,
    proxy: 'http://118.244.236.27:1080'
  })
}

module.exports = { getLists };

getLists();
