var fs = require('fs');
var $ = jQuery = require('jquery');
$.csv = require('jquery-csv');

var sample = 'abstractart.csv';
fs.readFile(sample, 'UTF-8', function(err, csv) {
  $.csv.toArrays(csv, {}, function(err, data) {
    for(var i=0, len=data.length; i<len; i++) {
    //   console.log(data[i][1]);  
        console.log(data[i]);  
    }
  });
});