var prompt = require('./prompt'),
    getBackendUrls = require('./get-backend-urls'),
    config = require('./config'),
    ip = require('ip'),
    portScanner = require('./portscanner'),
    generateVcl = require('./generate-vcl'),
    runVarnish = require('./run-varnish'),
    runSphynx = require('./run-sphynx'),
    logger = require('./logger');

module.exports = function (sphynxPath) {
  Promise.resolve(config.get(process.argv[2]))
    .then(function (config) {
      if(config.existing){
        logger.info('Verify that the settings are correct. Enter new values for incorrect ones.');
      } else {
        logger.info('Before starting the Sphynx instance, you need to provide some information.');
      }
      return config;
    })
    .then(prompt.site)
    .then(getBackendUrls)
    .then(function (config) {
      if(config.existing){
        logger.info('Verify that the port mappings are still correct');
      } else {
        logger.info('If you are running one or more of the widget servers on your local machine, enter the port. Leave blank if not.');
      }
      return config;
    })
    .then(prompt.backendMapping)
    .then(function (config) {
      config.ip = ip.address();
      return config;
    })
    .then(portScanner.findSphynxPort)
    .then(generateVcl)
    .then(config.save)
    .then(runVarnish)
    .then(runSphynx(sphynxPath))
    .then(function (config) {
      logger.urls({
        'Sphynx': 'http://localhost:' + config.site.port,
        'Sphynx External': 'http://' + config.ip + ':' + config.site.port
      });
    })
    .catch(function (err) {
      logger.error(err);
    });
};
