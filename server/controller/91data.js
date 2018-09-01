const { knex} = require('../config/db');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const glob = require('glob')

knex.schema.withSchema('public').hasTable('yiyebaofu').then(function(exists) {
  console.log('table yiyebaofu', exists);
  if (!exists) {
    return knex.schema.withSchema('public').createTable('yiyebaofu', function(table) {
      table.increments();
      table.text('pageTitle');
      table.text('title');
      table.text('url').unique().notNull();
      table.integer('month');
      table.integer('season');
      table.boolean('is_downloaded').defaultTo(false);
      table.timestamp('created_time').defaultTo(knex.fn.now());

      console.log('table yiyebaofu has created!');
    });
  }
});
const articleColumn = ['id', 'title', 'is_open', 'is_top', 'is_draft', 'news_type',
  'publish_time_type', 'publish_time'];

const FEArticleColumn = ['id', 'title', 'cover', 'description', 'content', 'news_type', 'is_top', 'publish_time'];

module.exports = {
  handleYYBF: async (ctx) => {
    const DIR = path.resolve(__dirname, '../../sprider/data/cl');
    const entryFiles = glob.sync(DIR + '/*.json');
    const yiyebaofu = [];
    const filterYYBF = [];
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
        await knex('yiyebaofu').returning('id').insert(filterYYBF);
        for (const file of entryFiles) {
          fs.renameSync(file,
            path.resolve(__dirname, `../../sprider/data/cl_download/${file.split('/').slice(-1)}`))
        }
        ctx.body = {
          status: 'success2',
          data: {
            yiyebaofu,
            filterYYBF,
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

  }

};
