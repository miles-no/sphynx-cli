var path = require('path'),
    spawn = require('child_process').spawn,
    logger = require('./logger');

module.exports = function (config) {
  var varnishDir = path.join(process.env.HOME, '.sphynx', 'varnish');
  var child = spawn('varnishd', ['-F', '-f', config.vclPath, '-n', varnishDir, '-a', ':' + config.site.port]);
  child.stdout.on('data', function(data) {
    // logger.log(data.toString());
  });
  child.stderr.on('data', function(data) {
    // logger.error(data.toString());
  });

  return config;
};
