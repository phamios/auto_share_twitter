const puppeteer = require('puppeteer');
var fs = require('fs');
var $ = jQuery = require('jquery');
$.csv = require('jquery-csv');
//------------------------CONFIG --------------------
var DOMAIN = 'shoescorners.com';
var FILENAME = "all.csv";
var HASHTAG = "#shoescorners.com #shoes #sneaker #decor #homedecor";
//---------------------------------------------------

(async () => { 
  const browser = await puppeteer.launch({ headless: true });
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
  
  await facebook(browser, videos);
  
  await browser.close();
})() 


async function facebook(browser, videos) {
    //click
    var cookiefb = `sb=ohlyXti_aPimZjmpMv1z0eVB; datr=oxlyXjyCqlMqbzYmsyeEcwtQ; dpr=1.5; ; locale=vi_VN; c_user=100048005537050; xs=15%3A_qvzgSCxUFyJ0A%3A2%3A1585154059%3A-1%3A-1; fr=1qgvpvAGQUKzGPZVr.AWXDW87q7kLunJrs_NBh6oq5c68.Bechmi.Z4.AAA.0.0.Bee4gL.AWVC9Xu1; spin=r.1001895338_b.trunk_t.1585154060_s.1_v.2_; act=1585154124035%2F18; wd=1280x216; presence=EDvF3EtimeF1585154155EuserFA21B48005537050A2EstateFDutF1585154065698CEchF_7bCC`;
    var arrfb = cookiefb.split(";");
    var arrcookiefb = [];
    for (var item of arrfb) {
      item = item.trim() + ";expires=0; path=/";
      arrcookiefb.push(item);
    }
    const context = browser.defaultBrowserContext();
    context.overridePermissions("https://m.facebook.com/ducvietlaptopnhapkhau", ["geolocation", "notifications"]);
    var pagefb = await browser.newPage();
    pagefb.on('dialog', async dialog => {
      console.log('confirm!');
      await dialog.accept();
    });
    await pagefb.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
    await pagefb.setViewport({ width: 1280, height: 800 });
  
    var navigationPromisefb = pagefb.waitForNavigation();
  
    var URLfb = 'https://m.facebook.com/login/?ref=dbl&fl';
  
    await pagefb.goto(URLfb, { waitUntil: 'networkidle2', timeout: 0 });
    await pagefb.waitForSelector('#email_input_container');
    await navigationPromisefb;
    await pagefb.type('#m_login_email', 'ducvietlaptopnhapkhau@gmail.com');
    await pagefb.type('#m_login_password', 'xuanSon123!@#');
  
    await pagefb.click('#u_0_4');

    for (var video of videos) {
      try {
        await pagefb.waitFor(80000);
        URLfb = "https://m.facebook.com/Zhask-Bracelets-149102632430027";
        await pagefb.goto(URLfb, { waitUntil: 'networkidle2', timeout: 0 });
        await pagefb.evaluate(_ => {
          window.scrollBy(0, window.innerHeight);
        });
        await pagefb.waitFor(480000); 
        await navigationPromisefb; 
        await pagefb.click('._2ph_'); 
        await pagefb.waitFor(280000);
        await navigationPromisefb;
        await pagefb.click('textarea[class="_5whq input composerInput"]');
        await pagefb.type('textarea[class="_5whq input composerInput"]',video.link + ` ` + video.text + ` ` + video.tags);
      
        await pagefb.waitFor(180000);
        await pagefb.keyboard.press(String.fromCharCode(32));
        await pagefb.click('button[data-sigil="touchable submit_composer"]');
        await pagefb.waitForNavigation({ waitUntil: 'networkidle0' });
  
        console.log("fb comment! " + video.text);
  
      }
      catch (e) {
        console.log(e);
      }
    }
  }
  