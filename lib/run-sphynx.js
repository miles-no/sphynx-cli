var path = require('path'),
    spawn = require('child_process').spawn,
    objectAssign = require('object-assign'),
    logger = require('./logger');

module.exports = function (sphynxPath) {
  return function (config) {
    var child = spawn('node', [sphynxPath], {
      cwd: path.dirname(sphynxPath),
      env: objectAssign({
        SPHYNX_SITE_NAME: config.site.name,
        PORT: config.sphynxPort,
        SPHYNX_API_BASE_URL: config.site.api
      }, process.env)
    });
    child.stdout.on('data', function(data) {
      // logger.log(data.toString());
    });
    child.stderr.on('data', function(data) {
      logger.error(data.toString());
    });
    return config;
  };
};
