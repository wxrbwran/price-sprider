const puppeteer = require('puppeteer');
const account = 'wxrbw@qq.com';
const password = 'qingfei775';
(async () => {
  const browser = await puppeteer.launch({headless: false});//打开浏览器
  const page = await browser.newPage();//打开一个空白页
  await page.goto('http://www.yifile.com/account.php?action=login/');
  await page.type('#login-loginname', account);
  await page.type('#login-pwd', password);
  await page.click('input[type=submit]');
  await page.waitForNavigation({
    waitUntil: 'networkidle2'
  });
  await page.goto('http://www.yifile.com/file/XYHyInuXlFzdjR4Q62w.html');
  await page.waitForNavigation({
    waitUntil: 'networkidle2'
  });
  await page.mainFrame()
    .addScriptTag({
      url: 'https://cdn.bootcss.com/jquery/3.2.0/jquery.min.js'
    })
  await page.waitFor(2000)
  await page.waitForSelector('td');//等待页面加载出来，等同于window.onload
  const result = await page.evaluate(() => {
    const lists = $('td').text();
    return lists
  })
  console.log(result);
  await page.screenshot({path: './demo/screen_shot/example.png'});//截个图
  await browser.close();
})();
//
// (async () => {
//   const browser = await puppeteer.launch({
//     headless: true,
//   });//打开浏览器
//   const page = await browser.newPage();//打开一个空白页
//   await page.goto('https://www.ithome.com', {
//   });//打开网站
//   await page.mainFrame()
//     .addScriptTag({
//       url: 'https://cdn.bootcss.com/jquery/3.2.0/jquery.min.js'
//     })
//   await page.waitFor(2000)
//   await page.waitForSelector('.lst.lst-1.new-list');//等待页面加载出来，等同于window.onload
//   const result = await page.evaluate(() => {
//     const lists = $('.lst.lst-1.new-list').text();
//     return lists
//   })
//   console.log(result);
//   await page.screenshot({path: './demo/screen_shot/example.png'});//截个图
//   await browser.close();
// })();