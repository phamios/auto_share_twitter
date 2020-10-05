const puppeteer = require('puppeteer');
var fs = require('fs');
var $ = jQuery = require('jquery');
$.csv = require('jquery-csv');

//------------------------CONFIG --------------------
var DOMAIN = 'shoescorners.com';
var TIMEWAIT = 320000;
var FILENAME = "all.csv";
var HASHTAG = "#shoescorners.com #shoes #sneaker #decor #homedecor";
//---------------------------------------------------


(async () => {
  while(true)
  {
    try{
      const browser = await puppeteer.launch({ headless: false });

  //var cookie = `SID=vgdLhMgPRBHdLVLh8mNgIqp131pG9gkx7owXRgnxhxod9blWulEIuqauirjGLBYR1ptjqQ.; __Secure-3PSID=vgdLhMgPRBHdLVLh8mNgIqp131pG9gkx7owXRgnxhxod9blW6CvjALg-aHIvtcKSYXZ9tg.; HSID=AeeCJ1R1OhAGeFwzZ; SSID=Aiw_IhdcJEGuqPMoB; APISID=L7jeYk__yjr9RNK3/Aa8VFc-omalbG99YB; SAPISID=ove9QkIOwQZxkyd0/AXxGQP7VMGvyNXKaG; __Secure-HSID=AeeCJ1R1OhAGeFwzZ; __Secure-SSID=Aiw_IhdcJEGuqPMoB; __Secure-APISID=L7jeYk__yjr9RNK3/Aa8VFc-omalbG99YB; __Secure-3PAPISID=ove9QkIOwQZxkyd0/AXxGQP7VMGvyNXKaG; CONSENT=YES+VN.vi+202004; YSC=z8p7FoLjjRA; VISITOR_INFO1_LIVE=iONhhM_laT0; LOGIN_INFO=AFmmF2swRQIhAKUcL9QgsVTmjlzcXDpF2Rdzf_bdEK9bZb0ovvKlFxZiAiBkfYV7mPC44avX_p_chDlcNjWwpyJTmkZiEw5PeI3kfg:QUQ3MjNmeUxBSEFBamhVaXBqcGd1NWU5TzBvU0d2c05lWUJjYkEtM3R1NC1BWjFiUHJvOFFGUk9laVdQQTVWZnVqVUs1dVhBZnRUTm8weXk0UlB2NWR3ZEh0dzJtSzBIM0s5X1pVN1NGLWVZcF9Oc0tlQjVMcklTQ2JxeUVCSERCb0JGWV9DUExHRFpydV9XRTZFQ1RWZVViRkh3b1RsSkZyZXFNdkVYRkNJaWRRYnpWN2R4aGdvcHR6SjNkcUZSRU8xRDBIaTBnNi15; PREF=f4=4000000; SIDCC=AJi4QfFo4SFellPSCUxx9dIdzdNivxY01zwXzupjhYvW8r-4TgF2GbTwTpy78Gjp_PpgrDZYaw`;
  // var cookie = `NID=204=UisdrWq1IMFvhry5edfrJGLs4poacIrbxUSf2U22nYZOc47IG-YY8i3yPTcAesu8Zv8LFC53M7NcYEfsV2dxjAOf2YgIjNcEaz2ETs58DZ3bVpn4_DRdI2s_H9DWmFwDfqio7Prj6D8pz6hUHm1rVrorPtsz86jkKQ7JN-8BvIQ`
  ;
  // var arr = cookie.split(";");
  var arrcookie = [
    'NID=204=UisdrWq1IMFvhry5edfrJGLs4poacIrbxUSf2U22nYZOc47IG-YY8i3yPTcAesu8Zv8LFC53M7NcYEfsV2dxjAOf2YgIjNcEaz2ETs58DZ3bVpn4_DRdI2s_H9DWmFwDfqio7Prj6D8pz6hUHm1rVrorPtsz86jkKQ7JN-8BvIQ'
  ];
  for(var item of arr)
  {
      item = item.trim() + ";expires=0; path=/";
      arrcookie.push(item);
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
  const navigationPromise = page.waitForNavigation();
  //page.on('console', consoleObj => console.log(consoleObj.text()));

  var URL = 'https://www.youtube.com/results?search_query=home+decor+canvas+painting+ideas';
  //var URL = 'https://www.youtube.com/results?search_query=gameplay&sp=CAMSBAgEEAE%253D';
  await page.goto(URL, { waitUntil: 'load', timeout: 0 }).then(() => {
    page.evaluate(
      function (arrcookie) {
        if (arrcookie) {
          document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
          for (var coo of arrcookie) {
            document.cookie = coo;
          }
        }
      }, arrcookie);
  });
  if (arrcookie) {
    await page.goto(URL, { waitUntil: 'load', timeout: 0 })
  }

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

  const elementHandles = await page.$$('a.ytd-thumbnail');
  const propertyJsHandles = await Promise.all(
    elementHandles.map(handle => handle.getProperty('href'))
  );
  const SUB_URLS = await Promise.all(
    propertyJsHandles.map(handle => handle.jsonValue())
  );
  console.log(SUB_URLS.length);

  var subpage = await browser.newPage();
  var subnavigationPromise = subpage.waitForNavigation();
  await subpage.setViewport({ width: 1280, height: 800 });
  await subpage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
  for (var SUBURL of SUB_URLS) {
    await subpage.goto(SUBURL, { waitUntil: 'load', timeout: 0 }).then(() => {
      subpage.evaluate(
        function (arrcookie) {
          if (arrcookie) {
            document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
            for (var coo of arrcookie) {
              document.cookie = coo;
            }
          }
        }, arrcookie);
    });
    if (arrcookie) {
      await subpage.goto(SUBURL, { waitUntil: 'load', timeout: 0 })
    }




    await subpage.waitForSelector('h1.title');
    await subpage.evaluate(_ => {
      window.scrollBy(0, window.innerHeight);
    });
    await subpage.waitFor(2000);
    await subpage.waitForSelector('#comments');
    await subnavigationPromise;

    // await page.waitForSelector('.style-scope:nth-child(1) > #comment > #body > #main > #expander #content-text')
    // await page.click('.style-scope:nth-child(1) > #comment > #body > #main > #expander #content-text')

    // await page.waitForSelector('.style-scope:nth-child(2) > #comment > #body > #main > #expander #content-text')
    // await page.click('.style-scope:nth-child(2) > #comment > #body > #main > #expander #content-text')

    // await page.waitForSelector('.style-scope:nth-child(3) > #comment > #body > #main #content')
    // await page.click('.style-scope:nth-child(3) > #comment > #body > #main #content')
    /*
    await page.waitForSelector('.style-scope:nth-child(1) > #comment > #body > #main > #header > #header-author > #author-text > .style-scope')


    const comments = [];
    for (let i = 1; i < 5; i++) {
      const authorSelector = `.style-scope:nth-child(${i}) > #comment > #body > #main > #header > #header-author > #author-text > .style-scope`
      const commentSelector = `.style-scope:nth-child(${i}) > #comment > #body > #main > #expander #content-text`;
      await page.waitForSelector(commentSelector);
      await page.waitForSelector(authorSelector);
      const commentText = await getElText(page, commentSelector);
      const author = await getElText(page, authorSelector);

      if (commentText) {
        // write each comment to DB or file
        // or batch the for processing later
        console.log(`${author}: ${commentText}`);
        comments.push(commentText);
      }
    }
    */
    var flag = true;
    await subpage.waitFor(2000);
    try {
      await subpage.waitForSelector('#simple-box', {
        timeout: 6000
      });
    }
    catch (e) {
    }
    if (await subpage.$("#simple-box") == null) { flag = false };

     

    if (flag) {
      await subnavigationPromise;
      await subpage.evaluate(async () => {
        await new Promise((resolve, reject) => {
          // var arr = ["You're an awesome friend.", "You're a gift to those around you.", "You're a smart cookie.", "You are awesome!", "You have impeccable manners.", "I like your style.", "You have the best laugh.", "I appreciate you.", "You are the most perfect you there is.", "You are enough.", "You're strong.", "Your perspective is refreshing.", "I'm grateful to know you.", "You light up the room.", "You deserve a hug right now.", "You should be proud of yourself.", "You're more helpful than you realize.", "You have a great sense of humor.", "You've got an awesome sense of humor!", "You are really courageous.", "Your kindness is a balm to all who encounter it.", "You're all that and a super-size bag of chips.", "On a scale from 1 to 10, you're an 11.", "You are strong.", "You're even more beautiful on the inside than you are on the outside.", "You have the courage of your convictions.", "I'm inspired by you.", "You're like a ray of sunshine on a really dreary day.", "You are making a difference.", "Thank you for being there for me.", "You bring out the best in other people.", "Your ability to recall random factoids at just the right time is impressive.", "You're a great listener.", "How is it that you always look great, even in sweatpants?", "Everything would be better if more people were like you!", "I bet you sweat glitter.", "You were cool way before hipsters were cool.", "That color is perfect on you.", "Hanging out with you is always a blast.", "You always know -- and say -- exactly what I need to hear when I need to hear it.", "You help me feel more joy in life.", "You may dance like no one's watching, but everyone's watching because you're an amazing dancer!", "Being around you makes everything better!", "When you say, \"I meant to do that,\" I totally believe you.", "When you're not afraid to be yourself is when you're most incredible.", "Colors seem brighter when you're around.", "You're more fun than a ball pit filled with candy. (And seriously, what could be more fun than that?)", "That thing you don't like about yourself is what makes you so interesting.", "You're wonderful.", "You have cute elbows. For reals!", "Jokes are funnier when you tell them.", "You're better than a triple-scoop ice cream cone. With sprinkles.", "When I'm down you always say something encouraging to help me feel better.", "You are really kind to people around you.", "You're one of a kind!", "You help me be the best version of myself.", "If you were a box of crayons, you'd be the giant name-brand one with the built-in sharpener.", "You should be thanked more often. So thank you!!", "Our community is better because you're in it.", "Someone is getting through something hard right now because you've got their back. ", "You have the best ideas.", "You always find something special in the most ordinary things.", "Everyone gets knocked down sometimes, but you always get back up and keep going.", "You're a candle in the darkness.", "You're a great example to others.", "Being around you is like being on a happy little vacation.", "You always know just what to say.", "You're always learning new things and trying to better yourself, which is awesome.", "If someone based an Internet meme on you, it would have impeccable grammar.", "You could survive a Zombie apocalypse.", "You're more fun than bubble wrap.", "When you make a mistake, you try to fix it.", "Who raised you? They deserve a medal for a job well done.", "You're great at figuring stuff out.", "Your voice is magnificent.", "The people you love are lucky to have you in their lives.", "You're like a breath of fresh air.", "You make my insides jump around in the best way.", "You're so thoughtful.", "Your creative potential seems limitless.", "Your name suits you to a T.", "Your quirks are so you -- and I love that.", "When you say you will do something, I trust you.", "Somehow you make time stop and fly at the same time.", "When you make up your mind about something, nothing stands in your way.", "You seem to really know who you are.", "Any team would be lucky to have you on it.", "In high school I bet you were voted \"most likely to keep being awesome.\"", "I bet you do the crossword puzzle in ink.", "Babies and small animals probably love you.", "If you were a scented candle they'd call it Perfectly Imperfect (and it would smell like summer).", "There's ordinary, and then there's you.", "You're someone's reason to smile.", "You're even better than a unicorn, because you're real.", "How do you keep being so funny and making everyone laugh?", "You have a good head on your shoulders.", "Has anyone ever told you that you have great posture?", "The way you treasure your loved ones is incredible.", "You're really something special.", "Thank you for being you."];
          var arr = video;
          var randomarr = arr[Math.floor(Math.random() * arr.length)];
          //console.log(document.getElementById('simple-box').innerHTML);
         var comment = video.text + ` ` + video.link + `#freeshipping #worldwide #bestseller`;;
          // var comment = `<ytd-comment-dialog-renderer class="style-scope ytd-comment-simplebox-renderer">
          
          //     <ytd-commentbox id="commentbox" class="style-scope ytd-comment-dialog-renderer" added-attachment="none" prefilled-attachment_="none">
              
          //     <yt-img-shadow id="author-thumbnail" class="style-scope ytd-commentbox no-transition" style="background-color: transparent;" loaded=""><img id="img" class="style-scope yt-img-shadow" alt="1001Ways2Die" width="40" height="40" src="//lh3.googleusercontent.com/a-/AOh14GgUntY3R8s4iHOGSYV-ow3V4intUXhcTJPjbK98=s88"></yt-img-shadow>
          //     <div id="main" class="style-scope ytd-commentbox">
          //       <div id="divider-line" class="style-scope ytd-commentbox"></div>
          //       <div id="creation-box" class="not-focused style-scope ytd-commentbox">
          //         <paper-input-container id="input-container" no-label-float="" use-v2-underline="" class="style-scope ytd-commentbox"><!--css-build:shady-->
          
          //     <div class="floated-label-placeholder style-scope paper-input-container" aria-hidden="true" hidden="">&nbsp;</div>
          
          //     <div class="input-wrapper style-scope paper-input-container">
          //       <span class="prefix style-scope paper-input-container"></span>
          
          //       <div id="labelAndInputContainer" class="input-content style-scope paper-input-container">
                  
          //         <div slot="after-input" class="paper-input-input style-scope ytd-commentbox">
          //             <ytd-emoji-input id="emoji" class="style-scope ytd-commentbox">
              
          //     <yt-user-mention-autosuggest-input slot="input" class="style-scope ytd-commentbox">
              
          //     <yt-formatted-string id="contenteditable-textarea" slot="input" enable-content-editable="true" maxlength="10000" plaintext-only="true" required="true" split-lines="" class="style-scope ytd-commentbox">
          //     <div id="contenteditable-root" contenteditable="true" dir="auto" class="style-scope yt-formatted-string" aria-label="Bình luận công khai...">
          //     </div></yt-formatted-string>
          //     <iron-dropdown id="iron-dropdown" horizontal-align="auto" no-auto-focus="" no-overlap="true" class="style-scope yt-user-mention-autosuggest-input" vertical-align="top" aria-disabled="false" aria-hidden="true" style="outline: none; display: none;"><!--css-build:shady-->
          
          //     <div id="contentWrapper" class="style-scope iron-dropdown">
          //       <yt-user-mention-suggestions-dropdown id="dropdown" class="dropdown-content style-scope yt-user-mention-autosuggest-input" slot="dropdown-content" role="listbox">
              
              
          //     <dom-repeat index-as="index" notify-dom-change="" class="style-scope yt-user-mention-suggestions-dropdown"><template is="dom-repeat"></template></dom-repeat>
          //   </yt-user-mention-suggestions-dropdown>
          //     </div>
          // </iron-dropdown>
          //   </yt-user-mention-autosuggest-input>
          //     <iron-dropdown id="dropdown" allow-outside-scroll="" no-auto-focus="" vertical-align="bottom" class="style-scope ytd-emoji-input" horizontal-align="left" aria-disabled="false" aria-hidden="true" style="outline: none; display: none;"><!--css-build:shady-->
          
          //     <div id="contentWrapper" class="style-scope iron-dropdown">
          //       <div id="dropdown-content" class="dropdown-content style-scope ytd-emoji-input" slot="dropdown-content">
          //       </div>
          //     </div>
          // </iron-dropdown>
          //   </ytd-emoji-input>
          //           </div><ytd-backstage-dismissable-attachment id="dismissable-attachment" slot="after-input" class="style-scope ytd-commentbox" hidden="">
              
              
          //     <div id="attachment-preview-container" class="style-scope ytd-backstage-dismissable-attachment">
          //       <div id="attachment-preview" class="style-scope ytd-backstage-dismissable-attachment"></div>
          //       <div id="dismiss-button" class="style-scope ytd-backstage-dismissable-attachment"></div>
          //     </div>
          //   </ytd-backstage-dismissable-attachment><div id="attachment-preview" slot="after-input" class="style-scope ytd-commentbox"></div><div id="image-select" class="paper-input-input style-scope ytd-commentbox" slot="after-input" hidden="">
          //           </div><ytd-backstage-video-link-attachment id="video-link-attachment" slot="after-input" class="style-scope ytd-commentbox" hidden="">
              
          //     <div id="video-preview" class="style-scope ytd-backstage-video-link-attachment"></div>
          //     <div id="cancel-button" class="style-scope ytd-backstage-video-link-attachment"></div>
          //   </ytd-backstage-video-link-attachment>
          //       </div>
          
          //       <span class="suffix style-scope paper-input-container"></span>
          //     </div>
          
          //     <div class="underline style-scope paper-input-container" style="height: 0px;">
          //       <div class="unfocused-line style-scope paper-input-container"></div>
          //       <div class="focused-line style-scope paper-input-container"></div>
          //     </div>
          
          //     <div class="add-on-content style-scope paper-input-container">
                
          //     </div>
          // </paper-input-container>
          //       </div>
          //       <ytd-poll-attachment id="poll-attachment" class="style-scope ytd-commentbox" hidden="">
              
          //     <div id="poll-options" class="style-scope ytd-poll-attachment">
          //       <dom-repeat id="repeat" class="style-scope ytd-poll-attachment"><template is="dom-repeat"></template></dom-repeat>
          //     </div>
          //     <div id="add-option" class="style-scope ytd-poll-attachment"></div>
          //   </ytd-poll-attachment>
                
          //       <div id="poll-preview-edit-dialog" class="style-scope ytd-commentbox" hidden="">
          //         <yt-formatted-string class="style-scope ytd-commentbox"></yt-formatted-string>
          //         <div id="poll-preview" class="style-scope ytd-commentbox"></div>
          //       </div>
          //       <div id="footer" class="style-scope ytd-commentbox">
          //         <span id="emoji-button" class="style-scope ytd-commentbox" hidden=""></span>
          //         <div id="attachments" class="style-scope ytd-commentbox" hidden="">
          //           <span id="video-link-button" class="style-scope ytd-commentbox"></span>
          //           <span id="poll-button" class="style-scope ytd-commentbox"></span>
          //           <span id="image-button" class="style-scope ytd-commentbox"></span>
          //         </div>
          //         <div id="inline-scheduling-panel" class="style-scope ytd-commentbox"></div>
          //         <div id="footer-text" class="style-scope ytd-commentbox">
          //           <yt-formatted-string id="footer-message" class="footer-alert-message style-scope ytd-commentbox" hidden=""></yt-formatted-string>
          //           <yt-formatted-string id="zero-step-footer-text" class="style-scope ytd-commentbox"></yt-formatted-string>
          //         </div>
          //         <div id="access-restrictions-selector" class="style-scope ytd-commentbox"></div>
          //         <span id="char-count" class="style-scope ytd-commentbox" hidden="">0/</span>
          //         <div id="buttons" class="style-scope ytd-commentbox">
          //           <ytd-button-renderer id="cancel-button" class="style-scope ytd-commentbox style-text size-default" button-renderer="" use-keyboard-focused="" is-paper-button=""><a class="yt-simple-endpoint style-scope ytd-button-renderer" tabindex="-1"><paper-button id="button" class="style-scope ytd-button-renderer style-text size-default" role="button" tabindex="0" animated="" elevation="0" aria-disabled="false" aria-label="Hủy"><!--css-build:shady--><yt-formatted-string id="text" class="style-scope ytd-button-renderer style-text size-default">Hủy</yt-formatted-string></paper-button></a></ytd-button-renderer>
          //           <ytd-button-renderer id="submit-button" class="style-scope ytd-commentbox style-primary size-default" button-renderer="" use-keyboard-focused="" is-paper-button="" disabled=""><a class="yt-simple-endpoint style-scope ytd-button-renderer" tabindex="-1"><paper-button id="button" class="style-scope ytd-button-renderer style-primary size-default" role="button" tabindex="-1" animated="" elevation="0" aria-disabled="true" aria-label="Bình luận" disabled="" style="pointer-events: none;"><!--css-build:shady--><yt-formatted-string id="text" class="style-scope ytd-button-renderer style-primary size-default">Bình luận</yt-formatted-string></paper-button></a></ytd-button-renderer>
          //           <div id="option-menu" class="style-scope ytd-commentbox"></div>
          //         </div>
          //       </div>
          //       <div id="scheduling-panel" class="style-scope ytd-commentbox">
          //       </div>
          //       <div id="emojis" class="style-scope ytd-commentbox" hidden="">
          //         <span id="emoji-picker" class="style-scope ytd-commentbox"></span>
          //       </div>
          //     </div>
          //     <paper-spinner-lite class="style-scope ytd-commentbox" aria-hidden="true"><!--css-build:shady--><div id="spinnerContainer" class="  style-scope paper-spinner-lite"><div class="spinner-layer style-scope paper-spinner-lite"><div class="circle-clipper left style-scope paper-spinner-lite"><div class="circle style-scope paper-spinner-lite"></div></div><div class="circle-clipper right style-scope paper-spinner-lite"><div class="circle style-scope paper-spinner-lite"></div></div></div></div></paper-spinner-lite>
          //   </ytd-commentbox>
          //   </ytd-comment-dialog-renderer>`;
          document.getElementById('comment-dialog').innerHTML = comment;
          document.querySelector('#placeholder-area').click();
          
          var from = '0' + (Math.floor(Math.random() * 4) + 0);
          var to = (Math.floor(Math.random() * 59) + 0);
          if(to<10)
          {
            to = '0' + to;
          }
          var time = from +':' + to;
          document.getElementById('contenteditable-root').innerHTML = time + ' ' + randomarr;
          resolve();
        });
      });
      console.log(SUBURL);
      await subpage.click('#contenteditable-root'); // Clicking the link will indirectly cause a navigation
      await subpage.keyboard.press(String.fromCharCode(32));
      await subpage.keyboard.press(String.fromCharCode(13));
      await subpage.click('#submit-button'); 
      //#submit-button
      var ran = (Math.floor(Math.random() *400) + 30) * 1000;
      console.log(ran);
      await subpage.waitFor(ran);
    }

  }
  await subpage.close();

  // write to file, save to db, etc.
  await browser.close();
    }catch(e){

    }
  }
  
})()