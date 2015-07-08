var template = '[{blue:%s}] ';
var logger = require('eazy-logger').Logger({
  prefix: template.replace('%s', 'Sphynx'),
  useLevelPrefixes: false
});

function logUrls(urls) {
  var keys = Object.keys(urls);
  var longestName = 0;
  var longesturl = 0;
  var offset = 2;

  if (!keys.length) {
    return;
  }

  keys.forEach(function(key) {
    if (key.length > longestName) {
      longestName = key.length;
    }
    if (urls[key].length > longesturl) {
      longesturl = urls[key].length;
    }
  });

  var underline = getChars(longestName + offset + longesturl + 1, '-');

  logger.info('{bold:Access URLs:');
  logger.unprefixed('info', '{grey: %s', underline);

  keys.forEach(function(key, i) {
    var keyname = key;
    logger.unprefixed('info', ' %s: {magenta:%s}',
      getPadding(key.length, longestName + offset) + keyname,
      urls[key]
    );
  });

  logger.unprefixed('info', '{grey: %s}', underline);
}

function getChars(len, char) {
  return new Array(len).join(char);
}

function getPadding (len, max) {
  return new Array(max - (len + 1)).join(' ');
}

logger.urls = logUrls;

module.exports = logger;
