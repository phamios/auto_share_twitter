const puppeteer = require('puppeteer');
var fs = require('fs');
var $ = jQuery = require('jquery');
$.csv = require('jquery-csv');
//------------------------CONFIG --------------------
var DOMAIN = 'alleycorner.com';
var TIMEWAIT = 20000;
var FILENAME = "abstractart.csv";
var HASHTAG = "#alley #alleycorner.com #wallart #art #decor #homedecor";
//---------------------------------------------------

(async () => { 
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
  await page.setViewport({ width: 1280, height: 800 }); 
  const videos = []; 
  var fileurl = FILENAME;
  fs.readFile(fileurl, 'UTF-8', function(err, csv) {
    $.csv.toArrays(csv, {}, function(err, data) {
      for(var i=0, len=data.length; i<len; i++) {
      //   console.log(data[i][1]);  
          console.log(data[i]);  
          videos.push({
            id: data[i][0],
            link: data[i][1],
            text: HASHTAG + ' ' + data[i][2],
            img: 'https://i2.wp.com/'+ DOMAIN +'/wp-content/uploads/' + data[1][3],
          });
      }
    });
  });
  
  await twitter(browser, videos);
  
  await browser.close();
})()

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}



async function twitter(browser, videos) {

  var pagefb = await browser.newPage();
  pagefb.on('dialog', async dialog => {
    console.log('confirm!');
    await dialog.accept();
  });
  await pagefb.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
  await pagefb.setViewport({ width: 1280, height: 800 });
  var navigationPromisefb = pagefb.waitForNavigation();

  var URLfb = 'https://twitter.com/login';

  await pagefb.goto(URLfb, { waitUntil: 'networkidle2', timeout: 0 })
  await pagefb.type('input[type="text"]', 'wallcorners');
  await pagefb.type('input[type="password"]', '1q2w3e4r!@#');

  await pagefb.click('div[data-testid="LoginForm_Login_Button"]');
  for (var video of videos) {
    await pagefb.waitFor(TIMEWAIT);
    await pagefb.waitForSelector('.DraftEditor-editorContainer');
    await navigationPromisefb;
    await pagefb.click('.DraftEditor-editorContainer');
 
    var str = video.text + ` ` + video.link + `#freeshipping #worldwide #bestseller`;
    if (str.length >= 280) {
      str = str.substring(0, 280);
    }
    for (var i = 0, j = str.length; i < j; i++) {
      try {
        var charcode = String.fromCharCode(str.substring(i, i + 1).charCodeAt(0));
        await pagefb.keyboard.press(charcode);
      }
      catch (e) { }
    }

    await pagefb.keyboard.press(String.fromCharCode(Math.floor(Math.random() * 10).toString().charCodeAt(0)));
 
    await pagefb.keyboard.press(String.fromCharCode(32));
    await navigationPromisefb;

    await pagefb.evaluate(async () => {
      await new Promise((resolve, reject) => {
        document.querySelector('div[data-testid="tweetButtonInline"]').click();
        resolve();
      });
    });
    console.log("twt comment! " + video.id);
    //await pagefb.click('div[data-testid="tweetButtonInline"]'); 
    await pagefb.waitFor(TIMEWAIT + 10000);
  }
  await pagefb.waitFor(TIMEWAIT + 20000);
  await pagefb.close();
}