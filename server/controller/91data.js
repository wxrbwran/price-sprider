const { knex} = require('../config/db');
const moment = require('moment');
const cheerio = require('cheerio')
const request = require('request-promise')
const superagent = require('superagent')
const fs = require('fs');
const path = require('path');
const glob = require('glob')
const axios = require('axios')

knex.schema.withSchema('wxr').hasTable('yiyebaofu').then(function(exists) {
  console.log('table yiyebaofu', exists);
  if (!exists) {
    return knex.schema.withSchema('wxr').createTable('yiyebaofu', function(table) {
      table.increments();
      table.text('page_title');
      table.text('title');
      table.text('url').unique().notNull();
      table.integer('year').defaultTo(new Date().getFullYear());
      table.integer('month');
      table.integer('season');
      table.boolean('is_downloaded').defaultTo(false);
      table.timestamp('created_time').defaultTo(knex.fn.now());

      console.log('table yiyebaofu has created!');
    });
  }
});
const articleColumn = ['id', 'page_title', 'title', 'url', 'year', 'month', 'season', 'is_downloaded', 'created_time'];

module.exports = {
  handleYYBF: async (ctx) => {
    const DIR = path.resolve(__dirname, '../../sprider/data/cl');
    const entryFiles = glob.sync(DIR + '/*.json');
    const yiyebaofu = [];
    let filterYYBF = [];
    const sTitle = new Set();
    const sUrl = new Set();
    if (entryFiles.length === 0) {
      ctx.body = {
        status: 'success',
        code: 0,
        data: '空文件夹！',
      };
    } else {
      for (const file of entryFiles) {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'))
        delete data.text;
        yiyebaofu.push(...data.content);
      }
      for (const y of yiyebaofu) {
        if (!sTitle.has(y.title) && !sUrl.has(y.url)) {
          filterYYBF.push(y);
          sTitle.add(y.title);
          sUrl.add(y.url);
        }
      }
      try {
        const hasInDatabase = [];
        for (const item of filterYYBF) {
          const id = await knex('yiyebaofu')
            .where({ title: item.title })
            .orWhere({ url: item.url })
            .select('id')
          if (id.length > 0) {
            hasInDatabase.push(item)
          }
        }
        for (const d of hasInDatabase) {
          filterYYBF = filterYYBF.filter(i => (i.title !== d.title || i.url !== d.url))
        }
        await knex('yiyebaofu').returning('id').insert(filterYYBF);
        for (const file of entryFiles) {
          fs.renameSync(file,
            path.resolve(__dirname, `../../sprider/data/cl_download/${file.split('/').slice(-1)}`))
        }
        ctx.body = {
          status: 'success',
          data: {
            yiyebaofu,
            filterYYBF,
            hasInDatabase,
            yiyebaofuLength: yiyebaofu.length,
            filterYYBFLength: filterYYBF.length,
          },
        }
      } catch (e) {
        ctx.body = {
          status: 'fail',
          data: e.stack,
        };
      }
    }
  },
  // http://127.0.0.1:26339/open/createTask
  crawlYifileFileLink: async (ctx) => {
    try {
      const itemArr = await knex('yiyebaofu')
        .where({ is_downloaded: false })
        .orderBy('month')
        .orderBy('season')
        .limit(1)
        .select()
      const item = itemArr[0]
      const browserMsg={
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36",
        'Content-Type':'application/x-www-form-urlencoded'
      };

      //访问登录接口获取cookie
      function getLoginCookie() {
        return new Promise(function (resolve, reject) {
          superagent.post('http://www.yifile.com/account.php')
            .set(browserMsg)
            .type('form')
            .send({
              action: 'login',
              task: 'login',
              ref: 'http://www.yifile.com/',
              formhash: 'c9821bf7',
              username: 'wxrbw@qq.com',
              password: 'qingfei775',
              remember:1,
            })
            .redirects(5)
            .end(function (err, response) {
            //获取cookie
            // const cookie = response.headers["set-cookie"];
            resolve(response);
          });
        });
      }

      const options = {
        uri: `http://${item.url}`,
        transform: body => cheerio.load(body),
      }
      const res = await getLoginCookie()
      console.log(res);
      // const $ = await request(options)
      // const links = []
      // console.log($('#vipdown00001').text())
      // $('#vipdown00001 a').each(function () {
      //   const link = $(this).attr('href');
      //   console.log(link)
      //   links.push(link);
      // })
      // console.log(links);
      ctx.body = {
        status: 'success',
        // data: links,
        // item,
        res
      };
    } catch (e) {
      ctx.body = {
        status: 'fail',
        data: e.stack,
      };
    }
  },
  downloadFile: async (ctx) => {
    // 需开启proxyee-down
    console.log(ctx.request.body)
    try {
      const res = axios.post('http://127.0.0.1:26339/open/createTask',
        ctx.request.body);
      console.log(res);
      ctx.body = {
        status: 'success',
        data: res,
      }
    } catch (e) {
      ctx.body = {
        status: 'fail',
        data: e,
      };
    }
  },
  getSelectionParams: async (ctx) => {
    try {
      const months = await knex('yiyebaofu')
        .distinct('month')
        .where('is_downloaded', false)
        .select()
      ctx.body = {
        status: 'success',
        data: {months: months.map(m => m.month).sort((a, b) => a - b)},
      };
    } catch (e) {
      ctx.body = {
        status: 'fail',
        data: e.stack,
      };
    }
  },
  getDistinctSeasonByMonth: async (ctx) => {
    const { month } = ctx.request.query;
    try {
      const seasons = await knex('yiyebaofu')
        .distinct('season')
        .where('is_downloaded', false)
        .where('month', month)
        .select()
      ctx.body = {
        status: 'success',
        data: {seasons: seasons.map(s => s.season).sort((a, b) => a - b)},
      };
    } catch (e) {
      ctx.body = {
        status: 'fail',
        data: e.stack,
      };
    }
  },
  getAllTitles: async (ctx) => {
    try {
      const { page_size, page_at, month, season, is_downloaded, keyword } = ctx.request.query;
      const offset = page_size * (page_at - 1);
      // const countObj = await knex('yiyebaofu').count('id');
      // const total = +countObj[0].count;
      let rawString = '';
      let rawArray = [];
      console.log(month, season, is_downloaded)
      console.log(typeof is_downloaded)
      const queryObj = {};
      let allTitles = null;
      let titles = null;
      if (!!month) {
        queryObj.month = month;
      }
      if (!!season) {
        queryObj.season = season;
      }
      if (!!is_downloaded) {
        queryObj.is_downloaded = is_downloaded;
      }
      if (!!keyword) {
        allTitles = await knex
          .column(articleColumn)
          .where(queryObj)
          .andWhere('title', 'like', `%${keyword}%`)
          .from('yiyebaofu')
        titles = await knex
          .column(articleColumn)
          .where(queryObj)
          .andWhere('title', 'like', `%${keyword}%`)
          .limit(page_size)
          .offset(offset)
          .orderBy('month', 'esc')
          .orderBy('season', 'esc')
          .from('yiyebaofu');
      } else {
        allTitles = await knex
          .column(articleColumn)
          .where(queryObj)
          .from('yiyebaofu')
        // console.log(allTitles)
        titles = await knex
          .column(articleColumn)
          .where(queryObj)
          .limit(page_size)
          .offset(offset)
          .orderBy('month', 'esc')
          .orderBy('season', 'esc')
          .from('yiyebaofu');
      }
      ctx.body = {
        status: 'success',
        data: {
          titles,
          total: allTitles.length
        },
      };
    } catch (e) {
      ctx.body = {
        status: 'fail',
        data: e.stack,
      };
    }
  },
  editTitleStatusById: async (ctx) => {
    const { id, is_downloaded } = ctx.request.body
    try {
      await knex('yiyebaofu')
        .update('is_downloaded', is_downloaded)
        .where({id})
      ctx.body = {
        status: 'success',
        data: null
      }
    } catch (e) {
      ctx.body = {
        status: 'fail',
        data: e.stack
      };
    }
  }
};
