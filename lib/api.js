var request = require('superagent'),
    template = require('es6-template-strings');

require('superagent-as-promised')(request);

module.exports = {
  getModuleDefinitions: function (config) {
    var url = template('${api}/${site}/modules', {
      api: config.site.api,
      site: config.site.name
    });

    return request.get(url)
      .then(function (response) {
        return response.body;
      });
  }
};
