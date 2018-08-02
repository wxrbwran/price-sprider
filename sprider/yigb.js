// 获取区域房源信息
const cheerio = require('cheerio')
const rp = require('request-promise').defaults({
  proxy: 'http://127.0.0.1:1080'
})
const fs = require('fs')
const path = require('path')
const iconv = require("iconv-lite");
var http=require('http');

const getLists = async () => {
  const options = {
    uri: 'http://t66y.com/htm_data/7/1807/3225843.html',
    transform: body => {
      // console.log(body)
      const convertContent = iconv.decode(body, 'GBK')
      console.log(convertContent)
      return cheerio.load(convertContent)
    }
  }
  console.log(`正在爬${options.uri}`)
  const $ = await rp(options)
  let urls = []
  const text = $('.tpc_content.do_not_catch').text()
  console.log(text)
   urls.push({
     text,
  })
  fs.writeFileSync(path.resolve(__dirname, './data/json/urls.json'),
     JSON.stringify(urls, null, 2))
}

module.exports = { getLists }

getLists();