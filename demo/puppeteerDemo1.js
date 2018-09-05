// const puppeteer = require('puppeteer');
//
// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('https://www.baidu.com');
//   await page.screenshot({path: './demo/screen_shot/example.png'});
//   await browser.close();
// })();

const puppeteer = require('puppeteer');
const account = 'wxrbw@163.com';
const password = '775200';
(async () => {
  const browser = await puppeteer.launch({headless: false});//打开浏览器
  const page = await browser.newPage();//打开一个空白页
  await page.goto('http://www.yifile.com/account.php?action=login/');//打开网站
  await page.type('#login-loginname', account);
  await page.type('#login-pwd', password);
  await page.click('input[type=submit]');
  await page.waitForNavigation({
    waitUntil: 'load'
  });//等待页面加载出来，等同于window.onload
  await page.screenshot({path: './demo/screen_shot/example.png'});//截个图
  await browser.close();
})();