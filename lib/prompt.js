var prompt = require('prompt'),
    portscanner = require('portscanner');

prompt.message = '';
prompt.delimiter = '';
prompt.start();

var backendsSchema = {
  properties: {}
};

module.exports = {
  site: function (config) {
    var siteSchema = {
      properties: {
        api: {
          description: 'Base URL for Sphynx API:',
          required: true,
          default: config.site.api
        },
        name: {
          description: 'Name of the site:',
          required: true,
          default: config.site.name
        },
        port: {
          description: 'Port to run the site on:',
          required: true,
          default: config.site.port,
          message: 'Port is not available',
          before: function (value) {
            return parseInt(value);
          },
          conform: function (value) {
            var done, valid;
            portscanner.checkPortStatus(value, '127.0.0.1', function (err, status) {
              valid = status === 'closed';
              done = true;
            });
            require('deasync').loopWhile(function(){return !done;});
            return valid;
          }
        }
      }
    };
    return new Promise(function (resolve, reject) {
      prompt.get(siteSchema, function (err, result) {
        if(err){
          reject(err);
        } else {
          config.site = result;
          resolve(config);
        }
      });
    });
  },

  backendMapping: function (config) {
    var schema = config.backendUrls.reduce(function (memo, host) {
      memo.properties[host] = {
        description: host,
        before: function (value) {
          return parseInt(value);
        }
      };

      var existingMapping = config.backendMappings.filter(function (mapping) {
        return mapping.host === host;
      })[0];
      if(existingMapping && existingMapping.port){
        memo.properties[host].default = existingMapping.port;
      }
      return memo;
    }, backendsSchema);

    return new Promise(function (resolve, reject) {
      prompt.get(schema, function (err, result) {
        if(err) {
          reject(err);
        } else {
          var backends = Object.keys(result).map(function (key) {
            return {
              host: key,
              port: result[key]
            };
          });

          config.backendMappings = backends;
          resolve(config);
        }
      });
    });
  }
};
