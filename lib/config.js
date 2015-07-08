var fs = require('fs'),
    path = require('path');

var basePath = path.join(process.env.HOME, '.sphynx');

module.exports = {
  get: function (name) {
    var fileName = path.join(basePath, name + '.json');
    if (!fs.existsSync(fileName)){
      return {
        site: {},
        backendMappings: [],
        existing: false
      };
    }

    var config = require(fileName);
    config.existing = true;
    return config;
  },

  save: function (config) {
    if (!fs.existsSync(basePath)){
      fs.mkdirSync(basePath);
    }

    config.jsonPath = path.join(basePath, config.site.name + '.json');
    config.vclPath = path.join(basePath, config.site.name + '.vcl');

    fs.writeFileSync(config.jsonPath, JSON.stringify(config, null, 2));
    fs.writeFileSync(config.vclPath, config.vcl);
    return config;
  }
};
