const cheerio = require('cheerio')
const request = require('request-promise')
const fs = require('fs')
const path = require('path')

// import _ from 'loadsh'
// import path from 'path'
// import sleep from '../utils/sleep'
console.log(path.resolve(__dirname, './data/json/area.json'))

const getArea = async () => {
  const options = {
    uri: 'https://dz.fang.anjuke.com/loupan/all/',
    transform: body => cheerio.load(body)
  }
  console.log(`正在爬取${options.uri}`)
  const $ = await request(options)
  // console.log($)
  const area = []
  $('.filter-position .item-area .filter').eq(0).find('a').each(function () {
    const link = $(this).attr('href')
    const short = link.split('/').slice(-2)[0];
    const text = $(this).text()
    area.push({ link, short, text })
  })
  console.log(`area length: ${area.length}`)
  fs.writeFileSync(path.resolve(__dirname, './data/json/area.json'),
    JSON.stringify(area, null, 2), 'utf-8')
}

getArea()
