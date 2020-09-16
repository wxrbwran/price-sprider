const { knex } = require('../config/db');
const moment = require('moment');
const cheerio = require('cheerio');
const request = require('request-promise');
const superagent = require('superagent');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const axios = require('axios');
const getDimensions = require('get-video-dimensions');

const videofile = [
  'mp4',
  'avi',
  'mkv',
  'mov',
  'wmv',
  'ts',
  'm2ts',
  'mpg',
  'rmvb',
  'rm',
];
async function checkVideo(dir) {
  try {
    const dimensions = await getDimensions(dir);
    // console.log(dir);
    // console.log(dimensions.width);
    // console.log(dimensions.height);
    return dimensions;
  } catch (err) {
    console.log(err);
  }
}

async function fileDisplay(filePath, res) {
  //根据文件路径读取文件，返回文件列表
  const files = fs.readdirSync(filePath);
  // files.forEach(async function(filename) {

  // });
  for await (const filename of files) {
    //获取当前文件的绝对路径
    var filedir = path.join(filePath, filename);
    //根据文件路径获取文件信息，返回一个fs.Stats对象
    const stats = fs.statSync(filedir);
    var isFile = stats.isFile(); //是文件
    var isDir = stats.isDirectory(); //是文件夹
    if (isFile) {
      // console.log(filename); // 读取文件内容
      const [ext, ...rest] = filename.split('.').reverse();
      // console.log(ext);
      if (videofile.includes(ext)) {
        // console.log('shipin');
        const dimensions = await checkVideo(filedir);
        console.log(dimensions);
        res.push({ ...dimensions, filename, filedir });
      }
      //   var content = fs.readFileSync(filedir, "utf-8");
      //   console.log(content);
    }
    if (isDir) {
      await fileDisplay(filedir, res); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
    }
  }
  console.log(res);
  return res;
}

module.exports = {
  handleCheckVideo: async (ctx) => {
    console.log(ctx.request.body);
    let res = [];
    const { path } = ctx.request.body;
    const list = await fileDisplay(path, res);
    ctx.body = {
      status: 'success',
      data: { path, list },
    };
  },
};
