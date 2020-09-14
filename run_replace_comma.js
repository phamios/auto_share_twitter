var Algorithmia = require("algorithmia");

(async () => {
  var fs = require('fs');
 
  fs.readFile('text.txt', 'utf8', function(err, contents) {
    Algorithmia.client("sim6oiWSoUve3DnMIAleKYgQehn1")
    .algo("nlp/AutoTag/1.0.1?timeout=300")
    .pipe(contents)
    .then(function(response) {
      arr = response.get();
      var convert = arr.join(',');
      console.log(convert);
      console.log('#'+convert.replace(/ /g,'').replace(/,/g,'#'));
    });
  });
  
})()