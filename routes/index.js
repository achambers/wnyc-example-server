var express = require('express');
var router  = express.Router();

var bluebird = require('bluebird');
var redis    = require('redis');

var client  = redis.createClient({host: 'localhost', port: '65535'});
var Promise = bluebird;

bluebird.promisifyAll(redis.RedisClient.prototype);

router.get('/', function(req, res, next) {
  var prefix = 'overhaul';

  if (req.query.staff) {
    prefix = 'staff';
  } else if (req.query.features) {
    prefix = 'features';
  }

  Promise.resolve().then(function() {
    if (req.query.revision) {
      return req.query.revision;
    }

    return client.getAsync(prefix + ':index:current');
  })
  .then(function(key) {
    return client.getAsync(prefix + ':index:' + key);
  })
  .then(function(json) {
    res.send(json);
  });
});

module.exports = router;
