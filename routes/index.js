var express = require('express');
var app = express();
var http = require('http');
var request = require('request');
var converter = require('rel-to-abs');
var fs = require('fs');


app.get('/', function (req, res) {
  res.render('index', { title: 'ewebshot' });
});

app.get('/content', function (req, res) {
  web_url = req.query.web_url;
  screen_size = req.query.screen_size;
  var webshot = require('node-webshot');
  console.log('screen_size', screen_size)
  var options = {
    screenSize: {
      width: screen_size

    }
    , shotSize: {
      width: screen_size
      , height: 'all'
    }

  };

  timeNow = new Date();
  mRandom = Math.floor((Math.random() * 1000000) + 1);
  fileName = 'tmp/s_' + timeNow.getTime() + '_' + mRandom + '.jpeg';
  result = {
    url: fileName,
    status: true
  }
  console.log('Test: /private/var/nodeapp/web-capture/public/' + fileName)
  webshot(web_url, 'public/' + fileName, options, function (err) {
    if (err) {
      result = {

        status: false
      }
    }

    res.format({
      json: function () {
        res.json(result);
      }
    });
  });

});

app.post('/save', function (req, res, next) {
  var filename = req.body.filename;
  var file = req.body.file;
  var base64Data;
  fileBuffer = decodeBase64Image(file);
  timeNow = new Date();
  mRandom = Math.floor((Math.random() * 1000000) + 1);
  fileUrl = 'upload/s_' + timeNow.getTime() + '_' + mRandom + '.jpg';
  fs.writeFile('public/' + fileUrl, fileBuffer.data);
  result = {
    url: fileUrl,
    status: true
  }

  res.format({
    json: function () {
      res.json(result);
    }
  });

});

function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

module.exports = app;
