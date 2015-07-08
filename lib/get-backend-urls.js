var url = require('url'),
    api = require('./api');

module.exports = function (config) {
  return api.getModuleDefinitions(config)
    .then(function (definitions) {
      return definitions.map(function (definition) {
        return url.parse(definition.url).host;
      }).filter(function (url, index, self) {
        return !!url && self.indexOf(url) === index;
      });
    })
    .then(function (backends) {
      config.backendUrls = backends;
      return config;
    });
};
