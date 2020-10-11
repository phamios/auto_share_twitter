const puppeteer = require('puppeteer');
var fs = require('fs');
var $ = jQuery = require('jquery');
$.csv = require('jquery-csv');
//------------------------CONFIG --------------------
var DOMAIN = 'linhcorner.com';
var TIMEWAIT = 5000;
var FILENAME = "linhcorner.csv";
var HASHTAG = "#beauty #cosmetic ";
var BOARDNAME = "Cosmetic Beauty";
var USERNAME = "ceo.ihdgroup@gmail.com";
var PASSWORD = '1q2w3e4r!@#';
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
          videos.push({
            id: data[i][0],
            link: data[i][1],
            text: HASHTAG + ' ' + data[i][2],
            img: 'https://i2.wp.com/'+ DOMAIN +'/wp-content/uploads/' + data[1][3],
          });
      }
    });
  });
  
  await pinterest(browser, videos);
  
  await browser.close();
})()

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

async function pinterest(browser, videos) {

  var pagefb = await browser.newPage();
  pagefb.on('dialog', async dialog => {
    console.log('confirm!');
    await dialog.accept();
  });
  await pagefb.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
  await pagefb.setViewport({ width: 1280, height: 800 });
  var navigationPromisefb = pagefb.waitForNavigation();

  var URLfb = 'https://www.pinterest.com/login/';

  await pagefb.goto(URLfb, { waitUntil: 'networkidle2', timeout: 0 })
  
  await pagefb.type('input[id="email"]', USERNAME);
  await pagefb.type('input[type="password"]', PASSWORD);
  //find the attribute of button and click
  const buttonLogin = await pagefb.$('button[class="red SignupButton active"]');
  await buttonLogin.evaluate( form => form.click() );
 
  for (var video of videos) {
    await pagefb.waitFor(80000);
    // await subpage.waitFor(TIMEWAIT + 5000); 
    var linkShare = 'https://www.pinterest.com/pin/create/button/?url='+video.link+'&media='+video.img+'&description='+video.text + ` #cosmetic #homedecor #wallart #beauty`;
    console.log(linkShare);
    // await subpage.goto(linkShare, { waitUntil: 'load', timeout: 0 })
    // await subpage.waitFor(TIMEWAIT + 5000);
    await pagefb.goto(linkShare, { waitUntil: 'networkidle2', timeout: 0 })
    await navigationPromisefb;
    await pagefb.waitFor(80000);
    //type to search
    await pagefb.type('input[id="pickerSearchField"]',BOARDNAME.trim());
    // const input = await pagefb.$(`input#pickerSearchField`);
    // await input.press('Backspace');

    // await pagefb.type('input[id="pickerSearchField"]',"Cosmetic Beauty");
    
    await pagefb.waitFor(TIMEWAIT + 5000); 
    await navigationPromisefb;
    // click Enter
    await pagefb.keyboard.press(String.fromCharCode(32));
    await page.keyboard.press('Enter');


  
    // await pagefb.evaluate(async () => {
    //   await new Promise((resolve, reject) => {
    //     document.querySelector('div[data-testid="tweetButtonInline"]').click();
    //     resolve();
    //   });
    // });
    console.log("Pin finished: " + video.id);
    // await pagefb.waitFor(TIMEWAIT + 10000);
  }

//   await pagefb.waitFor(TIMEWAIT + 20000);
  await pagefb.close();
}