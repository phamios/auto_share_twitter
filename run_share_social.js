const puppeteer = require('puppeteer');

async function getElText(page, selector) {
  return await page.evaluate((selector) => {
    return document.querySelector(selector).innerText
  }, selector);
}

(async () => {
  //login youtube
  //get list links public and title + tags

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
  await page.setViewport({ width: 1280, height: 800 });
  //page.on('console', consoleObj => console.log(consoleObj.text()));

  var URL = 'https://www.youtube.com/channel/UCo34Knp1OwWBPTSbSk_qvQg/videos?view=0&sort=dd&flow=grid';

  await page.goto(URL, { waitUntil: 'load', timeout: 0 })

  //scroll infinite
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var height = document.documentElement.scrollHeight;
      window.scrollBy(0, document.documentElement.scrollHeight);
      var totalHeight = 0;
      var distance = 300;
      var itv = 200;
      var count = 0;
      var timer = setInterval(() => {
        if (count == 2) {
          itv = 0;
        }
        if (height == document.documentElement.scrollHeight) {
          count = count + 1;
        }
        var scrollHeight = document.documentElement.scrollHeight;
        height = scrollHeight;
        window.scrollBy(0, scrollHeight);

        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, itv);
    });
  });
  
  const elementHandles = await page.$$('ytd-grid-video-renderer');

  var subpage = await browser.newPage();
  await subpage.setViewport({ width: 1280, height: 800 });
  const videos = [];
  for (let i = 0; i < elementHandles.length; i++) {
    var elem = await elementHandles[i].$$('#video-title');
    var link = await (await elem[0].getProperty('href')).jsonValue();
    var text = await (await elem[0].getProperty('textContent')).jsonValue();
    var image = await elementHandles[i].$$('#img');

    var img = await (await image[0].getProperty('src')).jsonValue();
    await subpage.goto(link, { waitUntil: 'networkidle2', timeout: 0 });
    try {
      await subpage.waitForSelector('#description');
      var tags = [];
      var description = await subpage.$$('#description yt-formatted-string a');
      for (let i = 0; i < description.length; i++) {
        var tag = await (await description[i].getProperty('textContent')).jsonValue();
        if (!tag.includes('http')) {
          tags.push(tag);
        }
      }
      videos.push({
        link: link,
        text: text + ' kawaicorner',
        img: img,
        tags: tags
      });
      console.log("pushed! " + text);
    } catch (e) {
      console.log(e);
    }

  }
  await subpage.close();


  await twitter(browser, videos);
  await pinterest(browser, videos);
  await tumblr(browser, videos);
  await mix(browser, videos);
  await folkd(browser, videos);
  await facebook(browser, videos);
  //

  //login twitter page
  //post with hash tags



  //login instagram page
  //post with hash tags

  //login pinterest page
  //post with hash tags

  // write to file, save to db, etc.
  await browser.close();
})()

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function facebook(browser, videos) {

  //login facebook page
  //post with hash tags

  //click
  var cookiefb = `sb=ohlyXti_aPimZjmpMv1z0eVB; datr=oxlyXjyCqlMqbzYmsyeEcwtQ; dpr=1.5; ; locale=vi_VN; c_user=100048005537050; xs=15%3A_qvzgSCxUFyJ0A%3A2%3A1585154059%3A-1%3A-1; fr=1qgvpvAGQUKzGPZVr.AWXDW87q7kLunJrs_NBh6oq5c68.Bechmi.Z4.AAA.0.0.Bee4gL.AWVC9Xu1; spin=r.1001895338_b.trunk_t.1585154060_s.1_v.2_; act=1585154124035%2F18; wd=1280x216; presence=EDvF3EtimeF1585154155EuserFA21B48005537050A2EstateFDutF1585154065698CEchF_7bCC`;
  var arrfb = cookiefb.split(";");
  var arrcookiefb = [];
  for (var item of arrfb) {
    item = item.trim() + ";expires=0; path=/";
    arrcookiefb.push(item);
  }
  const context = browser.defaultBrowserContext();
  //        URL                  An array of permissions
  context.overridePermissions("https://www.facebook.com/login/?next=https%3A%2F%2Fwww.facebook.com%2F1001ways2die-107161314259561%2F", ["geolocation", "notifications"]);
  var pagefb = await browser.newPage();
  pagefb.on('dialog', async dialog => {
    console.log('confirm!');
    await dialog.accept();
  });
  await pagefb.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
  await pagefb.setViewport({ width: 1280, height: 800 });

  var navigationPromisefb = pagefb.waitForNavigation();
  //pagefb.on('console', consoleObj => console.log(consoleObj.text()));

  var URLfb = 'https://www.facebook.com/login/?next=https%3A%2F%2Fwww.facebook.com%2F1001ways2die-107161314259561%2F';

  await pagefb.goto(URLfb, { waitUntil: 'networkidle2', timeout: 0 });
  await pagefb.waitForSelector('#email');
  await navigationPromisefb;
  await pagefb.type('#email', '');
  await pagefb.type('#pass', '');

  await pagefb.click('#loginbutton');
  for (var video of videos) {
    try {
      await pagefb.waitFor(5000);
      await pagefb.goto(URLfb, { waitUntil: 'networkidle2', timeout: 0 });
      await pagefb.evaluate(_ => {
        window.scrollBy(0, window.innerHeight);
      });
      await pagefb.waitFor(2000);
      await pagefb.waitForSelector('#feedx_sprouts_container');
      await navigationPromisefb;
      await pagefb.waitForSelector('#feedx_sprouts_container .navigationFocus');
      await navigationPromisefb;
      await pagefb.click('#feedx_sprouts_container .navigationFocus');


      await navigationPromisefb;
      await pagefb.evaluate(async (video) => {
        await new Promise((resolve, reject) => {
          //console.log(idsel.innerHTML);
          var x = document.getElementById("feedx_sprouts_container");
          var sel = x.querySelector(".navigationFocus");
          sel.innerHTML = video.link + ` ` + video.text + ` ` + video.tags.join(' ');
          sel.focus();
          sel.setSelectionRange(sel.value.length, sel.value.length);
          resolve();
        }, video);
      }, video);

      //await pagefb.click('#feedx_sprouts_container .navigationFocus'); 
      await pagefb.keyboard.press(String.fromCharCode(32));
      await pagefb.waitFor(5000);
      await pagefb.click('#feedx_sprouts_container button[type="submit"]');
      await pagefb.waitForNavigation({ waitUntil: 'networkidle0' });

      console.log("fb comment! " + video.text);

    }
    catch (e) {

    }
  }
}



async function twitter(browser, videos) {

  //login facebook page
  //post with hash tags

  //click

  var pagefb = await browser.newPage();
  pagefb.on('dialog', async dialog => {
    console.log('confirm!');
    await dialog.accept();
  });
  await pagefb.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
  await pagefb.setViewport({ width: 1280, height: 800 });
  var navigationPromisefb = pagefb.waitForNavigation();
  //pagefb.on('console', consoleObj => console.log(consoleObj.text()));

  var URLfb = 'https://twitter.com/login';

  await pagefb.goto(URLfb, { waitUntil: 'networkidle2', timeout: 0 })
  await pagefb.type('input[type="text"]', 'dien vao day');
  await pagefb.type('input[type="password"]', 'dien vao day');

  await pagefb.click('div[data-testid="LoginForm_Login_Button"]');
  for (var video of videos) {
    await pagefb.waitFor(2000);
    await pagefb.waitForSelector('.DraftEditor-editorContainer');
    await navigationPromisefb;
    await pagefb.click('.DraftEditor-editorContainer');



    var str = video.link + ` ` + video.text + ` ` + video.tags.join(',').replace(/#/g, '');
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
    //await pagefb.click('a[data-testid="addButton"]');


    await pagefb.keyboard.press(String.fromCharCode(32));
    await navigationPromisefb;

    await pagefb.evaluate(async () => {
      await new Promise((resolve, reject) => {
        document.querySelector('div[data-testid="tweetButtonInline"]').click();
        resolve();
      });
    });
    console.log("twt comment! " + video.text);
    //await pagefb.click('div[data-testid="tweetButtonInline"]'); 
    await pagefb.waitFor(5000);
  }
  await pagefb.waitFor(4000);
  await pagefb.close();
}


async function pinterest(browser, videos) {

  //login facebook page
  //post with hash tags

  //click

  var pagefb = await browser.newPage();
  pagefb.on('dialog', async dialog => {
    console.log('confirm!');
    await dialog.accept();
  });
  await pagefb.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');

  var navigationPromisefb = pagefb.waitForNavigation();
  //pagefb.on('console', consoleObj => console.log(consoleObj.text()));

  var URLfb = 'https://www.pinterest.com/pin-builder/';

  await pagefb.goto(URLfb, { waitUntil: 'networkidle2', timeout: 0 });
  await pagefb.waitForSelector('div[data-test-id="simple-login-button"]');
  await navigationPromisefb;
  await pagefb.click('div[data-test-id="simple-login-button"]');
  await pagefb.waitForSelector('#email');
  await navigationPromisefb;
  await pagefb.type('#email', '');
  await pagefb.waitFor(2000);
  await pagefb.waitForSelector('#password');
  await navigationPromisefb;
  await pagefb.type('#password', '');
  await pagefb.waitFor(2000);
  await pagefb.click('div[data-test-id="registerFormSubmitButton"]');
  await navigationPromisefb;

  await pagefb.waitFor('div[data-test-id="button-container"]');
  await navigationPromisefb;



  for (var video of videos) {
    try {
      await pagefb.goto(URLfb, { waitUntil: 'networkidle2', timeout: 0 });
      await pagefb.click('div[data-test-id="save-from-site-button"]');

      var link = video.link;
      for (var i = 0, j = link.length; i < j; i++) {
        try {
          var charcode = String.fromCharCode(link.substring(i, i + 1).charCodeAt(0));
          await pagefb.keyboard.press(charcode);
        }
        catch (e) { }
      }
      await pagefb.waitFor(2000);
      await pagefb.click('div[data-test-id="website-link-submit-button"]');
      await pagefb.waitFor(2000);

      await pagefb.waitForSelector('div[data-test-id="pin-builder-draft"] div[role="button"]');
      await navigationPromisefb;
      await pagefb.click('div[data-test-id="pin-builder-draft"] div[role="button"]');
      await pagefb.click('div[data-test-id="scrape-view-add-button"]');



      await pagefb.click('textarea[placeholder="Add your title"]');
      var title = video.text;
      for (var i = 0, j = title.length; i < j; i++) {
        try {
          var charcode = String.fromCharCode(title.substring(i, i + 1).charCodeAt(0));
          await pagefb.keyboard.press(charcode);
        }
        catch (e) { }
      }
      await pagefb.waitFor(2000);


      await pagefb.click('textarea[placeholder="Tell everyone what your Pin is about"]');
      var des = video.tags[0] + video.tags[1] + video.tags[2];
      for (var i = 0, j = des.length; i < j; i++) {
        try {
          var charcode = String.fromCharCode(des.substring(i, i + 1).charCodeAt(0));
          await pagefb.keyboard.press(charcode);
        }
        catch (e) { }
      }
      await pagefb.waitFor(2000);

      await pagefb.click('button[data-test-id="board-dropdown-save-button"]');

      await pagefb.waitForSelector('div[data-test-id="boardWithoutSection"] div[title="ios games"]');
      await navigationPromisefb;
      await pagefb.click('div[data-test-id="boardWithoutSection"] div[title="ios games"]');
      await pagefb.click('button[data-test-id="board-dropdown-save-button"]');
      console.log('pinned! ' + title);
      await pagefb.waitFor(10000);
    }
    catch (e) {

    }


  }
  await pagefb.close();
}



async function tumblr(browser, videos) {

  //login facebook page
  //post with hash tags

  //click

  var pagefb = await browser.newPage();
  pagefb.on('dialog', async dialog => {
    console.log('confirm!');
    await dialog.accept();
  });
  await pagefb.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');

  var navigationPromisefb = pagefb.waitForNavigation();
  //pagefb.on('console', consoleObj => console.log(consoleObj.text()));

  var URLfb = 'https://www.tumblr.com/new/link';

  await pagefb.goto(URLfb, { waitUntil: 'networkidle2', timeout: 0 });


  await pagefb.waitForSelector('#signup_determine_email');
  await navigationPromisefb;
  await pagefb.type('#signup_determine_email', '');
  await pagefb.waitFor(2000);
  await pagefb.click('.signup_determine_btn');
  await pagefb.waitFor(4000);

  await pagefb.waitForSelector('#signup_magiclink .magiclink_password_container .forgot_password_link');
  //await navigationPromisefb;
  await pagefb.click('#signup_magiclink .magiclink_password_container .forgot_password_link');
  await pagefb.waitFor(2000);


  await pagefb.waitForSelector('#signup_password');
  await navigationPromisefb;
  await pagefb.type('#signup_password', '');
  await pagefb.waitFor(2000);
  await pagefb.click('#signup_forms_submit');

  await pagefb.waitFor(2000);

  for (var video of videos) {
    try {

      URLfb = 'https://www.tumblr.com/new/link';

      await pagefb.goto(URLfb, { waitUntil: 'networkidle2', timeout: 0 });

      await pagefb.waitForSelector('button.tumblelog-select');
      await navigationPromisefb;
      await pagefb.click('button.tumblelog-select');
      await pagefb.waitFor(2000);

      await pagefb.waitForSelector('.pop-menu ul li');
      await navigationPromisefb;
      await pagefb.click('.pop-menu ul li:nth-child(2)');

      await pagefb.waitForSelector('.link-editor .editor');
      await navigationPromisefb;
      await pagefb.click('.link-editor .editor');

      var link = video.link;
      for (var i = 0, j = link.length; i < j; i++) {
        try {
          var charcode = String.fromCharCode(link.substring(i, i + 1).charCodeAt(0));
          await pagefb.keyboard.press(charcode);
        }
        catch (e) { }
      }
      await pagefb.waitFor(2000);

      await pagefb.click('.title .editor-plaintext');

      var title = video.text;
      for (var i = 0, j = title.length; i < j; i++) {
        try {
          var charcode = String.fromCharCode(title.substring(i, i + 1).charCodeAt(0));
          await pagefb.keyboard.press(charcode);
        }
        catch (e) { }
      }
      await pagefb.waitFor(2000);


      var img = video.img;
      const clipboardy = require('clipboardy');
      await clipboardy.write(img.split('.jpg')[0] + '.jpg');
      await pagefb.click('div[aria-label="Description"]');
      await pagefb.waitFor(1000);

      await pagefb.keyboard.down('Control')
      await pagefb.keyboard.press('V')
      await pagefb.keyboard.up('Control')
      await pagefb.waitFor(2000);

      await pagefb.click('div[aria-label="Post tags"]');
      var tags = video.tags.join(',');
      for (var i = 0, j = tags.length; i < j; i++) {
        try {
          var charcode = String.fromCharCode(tags.substring(i, i + 1).charCodeAt(0));
          await pagefb.keyboard.press(charcode);
        }
        catch (e) { }
      }
      await pagefb.waitFor(2000);

      await pagefb.click('button.create_post_button');
      console.log('tumlr! ' + title);
      await pagefb.waitFor(10000);



    }
    catch (e) {

    }


  }
  await pagefb.close();
}


async function mix(browser, videos) {

  //login facebook page
  //post with hash tags

  //click

  var pagefb = await browser.newPage();
  await pagefb.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');

  var navigationPromisefb = pagefb.waitForNavigation();
  //pagefb.on('console', consoleObj => console.log(consoleObj.text()));

  var URLfb = 'https://mix.com/kawaicorner';

  await pagefb.goto(URLfb, { waitUntil: 'networkidle2', timeout: 0 });

  await pagefb.click('.AppHeader__auth-button--login');

  await pagefb.waitForSelector('.SocialProviderButton__icon--google');
  await navigationPromisefb;
  await pagefb.click('.SocialProviderButton__icon--google');

  await pagefb.waitForSelector('#identifierId');
  await navigationPromisefb;
  await pagefb.type('#identifierId', 'kawaicorner@gmail.com');
  await pagefb.click('#identifierNext');

  await pagefb.waitFor(4000);

  await pagefb.waitForSelector('input[type="password"]');
  await navigationPromisefb;
  await pagefb.type('input[type="password"]', '');
  await pagefb.click('#passwordNext');

  await pagefb.waitFor(10000);
  for (var video of videos) {
    try {

      await pagefb.waitForSelector('.AppHeader__button--add');
      await navigationPromisefb;
      await pagefb.click('.AppHeader__button--add');

      await pagefb.waitForSelector('.ContentAddModalUrlForm__url-input');
      await navigationPromisefb;
      await pagefb.click('.ContentAddModalUrlForm__url-input');

      var link = video.link;
      for (var i = 0, j = link.length; i < j; i++) {
        try {
          var charcode = String.fromCharCode(link.substring(i, i + 1).charCodeAt(0));
          await pagefb.keyboard.press(charcode);
        }
        catch (e) { }
      }
      await pagefb.waitForSelector('.ContentAddModalArticlePreview__article-image');
      await navigationPromisefb;
      await pagefb.click('.ContentAddModalUrlForm__add-button');

      await pagefb.waitFor(5000);
      await pagefb.click('.Modal__close-button');
      console.log('mix !', video.text);

    }
    catch (e) {

    }


  }
  await pagefb.close();
}


async function folkd(browser, videos) {

  //login facebook page
  //post with hash tags

  //click

  var pagefb = await browser.newPage();
  await pagefb.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');

  var navigationPromisefb = pagefb.waitForNavigation();
  //pagefb.on('console', consoleObj => console.log(consoleObj.text()));

  var URLfb = 'http://www.folkd.com/page/login.html';

  await pagefb.goto(URLfb, { waitUntil: 'networkidle2', timeout: 0 });

  await pagefb.waitForSelector('#username');
  await navigationPromisefb;
  await pagefb.type('#username', '');
  await pagefb.type('#password', '');
  await pagefb.click('#submit_login');

  await pagefb.waitFor(10000);

  for (var video of videos) {
    try {

      URLfb = 'http://www.folkd.com/page/submit.html';

      await pagefb.goto(URLfb, { waitUntil: 'networkidle2', timeout: 0 });

      await pagefb.evaluate( () => document.getElementById("url_page").value = "")
      await pagefb.type('#url_page', video.link);
      await pagefb.click('button[type="submit"]');
      await pagefb.waitFor(6000);

      await pagefb.type('#add_tags_show', video.tags.join(' '));
      
      await pagefb.click('input[type="submit"]');
      
      console.log('folkd !', video.text);
      await pagefb.waitFor(6000);
    }
    catch (e) {

    }


  }
  await pagefb.close();
}