var portscanner = require('portscanner');

module.exports = {
  findSphynxPort: function (config) {
    return new Promise(function (resolve, reject) {
      portscanner.findAPortNotInUse(config.site.port + 1, config.site.adminPort + 10, '127.0.0.1', function(err, port) {
        if(err){
          reject(err);
        } else {
          config.sphynxPort = port;
          resolve(config);
        }
      });
    });
  }
};
