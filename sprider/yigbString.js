// 获取区域房源信息
const fs = require('fs')
const path = require('path')
const { transNumber } = require('../utils/transNumber')

const getLists = () => {
  let urls = {}
  const pageTitle = ``;
  const text = `
  
  `;
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
  console.log(`写入结束，data length: ${urls.content.length}`)
}


getLists();
