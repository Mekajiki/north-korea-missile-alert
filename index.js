var request = require('request');

var YAHOO_URL = 'https://www.yahoo.co.jp/';
var NHK_URL = 'http://www3.nhk.or.jp/news/json16/new_001.json';
var NHK_HEAD_URL = 'http://www3.nhk.or.jp/news/json16/tvnews.json';

var DANGEROUS_WORDS = process.env['DANGEROUS_WORDS'] ?
  process.env['DANGEROUS_WORDS'].split(',') :
  ['北朝鮮', 'ミサイル'];


var HEADLINE_LENGTH = 20;

var WEBHOOK_URL = process.env['WEBHOOK_URL'];

exports.handler = function(event, context, lambdaCallback) {
  detectMissileByNHK(function(headline, url) {
    var payload =
    {
        text: "@here",
        attachments: [
          {
            color: 'danger',
            text: headline,
            pretext: url
          }
        ]
    };

    request({
      url: WEBHOOK_URL,
      method: "POST",
      json: payload
    }, function(err, res, body) {
      if (err) {
        lambdaCallback(err);
      }
      if (res.statusCode != 200) {
        lambdaCallback(res);
      }

      lambdaCallback(null, headline);
    });

  }, lambdaCallback);
}

function detectMissileByNHK(callback, lambdaCallback) {
  request(NHK_URL, function(err, res, body) {
    if (err) {
      lambdaCallback(err);
    }
    if (res.statusCode != 200) {
      lambdaCallback(res);
    }

    var json = JSON.parse(body);
    var threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
    json.channel.item.find(function (item) {
      var update = Date.parse(item.pubDate);
      var text = item.title;

      if (threeMinutesAgo < update &&
          detectMissile(text)) {
        var url = 'http://www3.nhk.or.jp/news/' + item.link;
        callback(text, url);
      }
    });
  });

  request(NHK_HEAD_URL, function(err, res, body) {
    if (err) {
      lambdaCallback(err);
    }
    if (res.statusCode != 200) {
      lambdaCallback(res);
    }

    var json = JSON.parse(body);
    if (json.viewFlg && detectMissile(json.title)) {
      callback(json.title, '');
    }
  });
}

function detectMissileByYahoo(callback, lambdaCallback) {
  request(YAHOO_URL, function(err, res, body) {
    if (err) {
      lambdaCallback(err);
    }
    if (res.statusCode != 200) {
      lambdaCallback(res);
    }

    if (detectMissile(body)) {
      callback(extractHeadline(body), YAHOO_URL);
    }
    else {
      lambdaCallback(null, "no missile");
    }
  });
}

function detectMissile(body) {
  return DANGEROUS_WORDS
    .map(function(word) {
      return body.search(word);
    })
    .reduce(function(acc, index) {
      return acc && (index > -1);
    }, true);
}

function extractHeadline(body) {
  var indices = DANGEROUS_WORDS
    .map(function(word) {
      return body.search(word);
    });
  var start = Math.min.apply(Math, indices);

  return body.substring(start, start + HEADLINE_LENGTH);
}
