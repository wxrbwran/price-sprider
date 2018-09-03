// 获取区域房源信息
const Crawler = require('crawler');
const fs = require('fs')
const path = require('path')
const { transNumber } = require('../utils/transNumber')

console.log(transNumber)

const lists = 'http://t66y.com/htm_data/7/1809/3263754.html'

const getLists = async () => {
  const uris = lists.replace(/\s/g, '').split('http://').filter(uri => !!uri).map(i => `http://${i}`);
  console.log(uris);
  for (const uri of uris) {
    const priceCrawler = new Crawler({
      rateLimit: 5000,
      forceUTF8: true,
      incomingEncoding: 'gbk',
      callback (err, res, done) {
        if (err) {
          console.log(err)
        } else {
          let urls = {}
          let $ = res.$
          const pageTitle = $('title').text().split(' - 技術討論區')[0]
          $('.tpc_content.do_not_catch a').each(function (item) {
            $(this).innerText = $(this).attr('href');
            console.log($(this).attr('href'));
          })
          const text = $('.tpc_content.do_not_catch').text()
          const pairs = text.split(pageTitle)[1] ? text.split(pageTitle)[1].split('.html') : text.split('.html')
          urls.content = []
          urls.title = pageTitle
          const tmpArr = pageTitle.split('月');
          console.log(tmpArr)
          urls.month = transNumber[tmpArr[0].slice(-1)]
          urls.season = transNumber[tmpArr[1].split('季')[0].split('第')[1]]
          for (const pair of pairs) {
            const tmp = {}
            const item = pair.split('https://')
            if (!!item[1]) {
              tmp.title = item[0]
                .split(/(下载|下載|【下载|【下載)/)[0]
                .replace(/(=|-)/g, '')
                .split(/(【影片大小】|【影片格式】|【语言字幕】|【资源格式】)/)[0]
                .trim()
              tmp.url = `${item[1]}.html`
              tmp.year = new Date().getFullYear();
              tmp.month = urls.month;
              tmp.season = urls.season;
              tmp.page_title = pageTitle;
              urls.content.push(tmp)
            }
          }
          urls.text = text
          fs.writeFileSync(path.resolve(__dirname, `./data/cl/${pageTitle}.json`),
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
