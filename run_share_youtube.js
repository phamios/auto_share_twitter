const puppeteer = require("puppeteer");
var fs = require("fs");
var $ = (jQuery = require("jquery"));
$.csv = require("jquery-csv");
//------------------------CONFIG --------------------
var DOMAIN = "shoescorners.com";
var TIMEWAIT = 320000;
var FILENAME = "all.csv";
var HASHTAG = "#shoescorners.com #shoes #sneaker #decor #homedecor";
var UERSNAMEYOUTUBE = "son.x.pham.boeing@gmail.com";
var PASSWORDYOUTUBE = "1q2w3e4r!@#";
//---------------------------------------------------

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36"
  );
  await page.setViewport({ width: 1280, height: 800 });
  const videos = [];
  var fileurl = FILENAME;
  fs.readFile(fileurl, "UTF-8", function (err, csv) {
    $.csv.toArrays(csv, {}, function (err, data) {
      for (var i = 0, len = data.length; i < len; i++) {
        videos.push({
          id: data[i][0],
          link: data[i][1],
          text: HASHTAG + " " + data[i][2],
          img:
            "https://i2.wp.com/" + DOMAIN + "/wp-content/uploads/" + data[1][3],
        });
      }
    });
  });

  await twitter(browser, videos);

  await browser.close();
})();

async function twitter(browser, videos) {
  var arrcookie = [
    "NID=204=UisdrWq1IMFvhry5edfrJGLs4poacIrbxUSf2U22nYZOc47IG-YY8i3yPTcAesu8Zv8LFC53M7NcYEfsV2dxjAOf2YgIjNcEaz2ETs58DZ3bVpn4_DRdI2s_H9DWmFwDfqio7Prj6D8pz6hUHm1rVrorPtsz86jkKQ7JN-8BvIQ",
  ];

  const pagefb = await browser.newPage();
  await pagefb.setViewport({ width: 1280, height: 800 });
  await pagefb.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36"
  );
  const navigationPromise = pagefb.waitForNavigation();

  await pagefb.goto(
    "https://accounts.google.com/ServiceLogin/identifier?service=youtube&uilel=3&passive=true&continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Did%26next%3Dhttps%253A%252F%252Fwww.youtube.com%252F&hl=id&ec=65620&flowName=GlifWebSignIn&flowEntry=AddSession",
    { waitUntil: "networkidle2", timeout: 0 }
  );
  await navigationPromise;
  await pagefb.type('input[type="email"]', UERSNAMEYOUTUBE);
  await pagefb.click(
    'button[class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc qIypjc TrZEUc"]'
  );
  await navigationPromise; 
  await pagefb.type('input[type="password"]', PASSWORDYOUTUBE);
  await pagefb.click(
    'button[class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc qIypjc TrZEUc"]'
  );
  await navigationPromise; 
  await pagefb.click('li[class="identity-prompt-account-list-item"]');
  await pagefb.click(
    'button[class="yt-uix-button yt-uix-button-size-default yt-uix-button-primary"]'
  );
  await navigationPromise; 
  await pagefb.goto(
    "https://www.youtube.com/results?search_query=home+decor+canvas+painting+ideas",
    { waitUntil: "networkidle2", timeout: 0 }
  );
   
  const elementHandles = await pagefb.$$("a.ytd-thumbnail");
  const propertyJsHandles = await Promise.all(
    elementHandles.map((handle) => handle.getProperty("href"))
  );
  const SUB_URLS = await Promise.all(
    propertyJsHandles.map((handle) => handle.jsonValue())
  );
  console.log(SUB_URLS.length);

  var subpage = await browser.newPage();
  var subnavigationPromise = subpage.waitForNavigation();
  await subpage.setViewport({ width: 1280, height: 800 });
  await subpage.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36"
  );
  for (var video of videos) {
    for (var SUBURL of SUB_URLS) {
      await subpage.waitForSelector("h1.title");
      await subpage.evaluate((_) => {
        window.scrollBy(0, window.innerHeight);
      });
      await subpage.waitFor(2000);
      await subpage.waitForSelector("#comments");
      await subnavigationPromise;

      var comment =
        video.text + ` ` + video.link + `#freeshipping #worldwide #bestseller`;
      var flag = true;
      await subpage.waitFor(2000);
      try {
        await subpage.waitForSelector("#simple-box", {
          timeout: 6000,
        });
      } catch (e) {}
      if ((await subpage.$("#simple-box")) == null) {
        flag = false;
      }
      if (flag) {
        await subnavigationPromise;
        await subpage.evaluate(async () => {
          await new Promise((resolve, reject) => {
            document.getElementById("comment-dialog").innerHTML = comment;
            document.querySelector("#placeholder-area").click();
            var from = "0" + (Math.floor(Math.random() * 4) + 0);
            var to = Math.floor(Math.random() * 59) + 0;
            if (to < 10) {
              to = "0" + to;
            }
            var time = from + ":" + to;
            document.getElementById("contenteditable-root").innerHTML =
              time + " " + comment;
            resolve();
          });
        });
        console.log(SUBURL);
        await subpage.click("#contenteditable-root"); // Clicking the link will indirectly cause a navigation
        await subpage.keyboard.press(String.fromCharCode(32));
        await subpage.keyboard.press(String.fromCharCode(13));
        await subpage.click("#submit-button");
        var ran = (Math.floor(Math.random() * 400) + 30) * 1000;
        console.log(ran);
        await subpage.waitFor(ran);
      }
    }
  }
}
