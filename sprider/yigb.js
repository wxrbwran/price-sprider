// 获取区域房源信息
const cheerio = require('cheerio')
const request = require('request-promise').defaults({
  proxy: 'http://127.0.0.1:1080',
})
const fs = require('fs')
const path = require('path')

// console.log(sleep)

const getLists = async () => {
  const options = {
    uri: 'http://t66y.com/htm_data/7/1807/3225843.html',
    transform: body => cheerio.load(body)
  }
  console.log(`正在爬${options.uri}`)
  const $ = await request(options)
  let urls = []

  const text = $('.tpc_content.do_not_catch').text()
  console.log(text)
  // urls.push({
  //   name,
  //   huxing,
  //   price,
  //   aroundPrice,
  //   address
  // })
  // fs.writeFileSync(path.resolve(__dirname, './data/json/urls.json'),
  //   JSON.stringify(urls, null, 2), 'utf-8')
}

module.exports = { getLists }

getLists()
