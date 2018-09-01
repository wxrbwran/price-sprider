// 获取区域房源信息
const cheerio = require('cheerio')
const request = require('request-promise')
const fs = require('fs')
const path = require('path')
const { sleep } = require('../utils/sleep')

let _house = [];
const getHouse = async (page = 1, area = '') => {
  const options = {
    uri: `https://dz.fang.anjuke.com/loupan/${area}/p${page}/`,
    transform: body => cheerio.load(body)
  }
  console.log(`正在爬${options.uri}`)
  const $ = await request(options)
  let house = []

  $('.key-list .item-mod').each(function () {
  	// console.log($(this).text())
    const name = $(this).find('.items-name').text()
    const address = $('.curr-area').text()
    const huxing = $(this).find('.huxing').text().trim().replace(/\s/g, '')
    const price = $(this).find('.price').text().trim().replace(/\s/g, '')
    const aroundPrice = $(this).find('.around-price').text().trim().replace(/\s/g, '')
    house.push({
      name,
      huxing,
      price,
      aroundPrice,
      address
    })
  })
  _house = [..._house, ...house]
  if ($('.next-page').attr('href')) {
    console.log(`${area}共有${_house.length}条数据`)
    await sleep(1000)
    page++;
    await getHouse(page, area)
  } else {
    console.log(`爬完了！${_house.length}`)
    return _house
  }
}

// 拿到了地区的分区，现在去检索每个分区下的房价
const getAreaDetail = async () => {
  const areas = require(path.resolve(__dirname, './data/json/area.json'))
  for (let i = 0; i < areas.length; i++) {
    _house = []
    console.log(`正在爬取${areas[i].text}`)
    const _area = areas[i].short;
    console.log(_area)
    const a = await getHouse(1, _area)
    console.log('a', a);
    areas[i].houseInfo = _house
  }
  fs.writeFileSync(path.resolve(__dirname, './data/json/AreaHouse.json'),
    JSON.stringify(areas, null, 2), 'utf-8')
}

module.exports = { getAreaDetail }

getAreaDetail()
