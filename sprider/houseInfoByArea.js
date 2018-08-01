// 获取区域房源信息
const cheerio = require('cheerio')
const request = require('request-promise')
const fs = require('fs')
const path = require('path')
const { sleep } = require('../utils/sleep')

// console.log(sleep)

let _house = []
let _area = ''
const getHouse = async (page = 1, area = '') => {
  const options = {
    uri: `https://dz.fang.anjuke.com/loupan/${area}/p${page}/`,
    transform: body => cheerio.load(body)
  }
  console.log(`正在爬${options.uri}`)
  const $ = await request(options)
  let house = []

  $('.key-list .item-mod').each(function () {
    const name = $(this).find('.infos .lp-name .items-name').text()
    const adress = $(this).find('.address .list-map').text()
    const huxing = $(this).find('.huxing').text()
    const favorPos = $(this).find('.favor-pos .price-txt').text()
    const aroundPrice = $(this).find('.favor-pos .around-price').text()
    house.push({
      name,
      huxing,
      favorPos,
      aroundPrice,
      adress
    })
  })
  _house = [..._house, ...house]
  if ($('.next-page').attr('href')) {
    // writeFileSync('./static/House.json',JSON.stringify(_house,null,2),'utf-8')
    console.log(`${area}共有${_house.length}条数据`)
    await sleep(1000)
    page++
    await getHouse(page, _area)
  } else {
    console.log(`爬完了！${_house.length}`)
    return _house
  }
}

// 拿到了地区的分区，现在去检索每个分区下的房价
const getAreaDetail = async () => {
  const area = require(path.resolve(__dirname, './data/json/Area.json'))
  for (let i = 0; i < area.length; i++) {
    _house = []
    console.log(`正在爬取${area[i].text}`)
    _area = area[i].short
    console.log(_area)
    await getHouse(1, area[i].short)
    area[i].houseInfo = _house
  }
  fs.writeFileSync(path.resolve(__dirname, './data/json/AreaHouse.json'),
    JSON.stringify(area, null, 2), 'utf-8')
}

module.exports = { getAreaDetail }

getAreaDetail()
