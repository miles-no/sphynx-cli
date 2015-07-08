'use strict';

var multiline = require('multiline'),
    template = require('es6-template-strings');

var backendTemplate = multiline(function () {/*
backend ${name} {
  .host = "${host}";
  .port = "${port}";
}
*/});

var backendHintTemplate = multiline(function () {/*
if (req.http.host ~ "(?i)^${host}$") {
  set req.backend_hint = ${name};
}
*/});

var backendHintPortTemplate = multiline(function () {/*
if (req.http.host ~ "(?i)^${host}:${port}$") {
  set req.backend_hint = ${name};
}
*/});

var vclTemplate = multiline(function () {/*
vcl 4.0;

${backends}

sub vcl_recv {
  ${backendHints}

  # Send Surrogate-Capability headers to announce ESI support to backend
  set req.http.Surrogate-Capability = "key=ESI/1.0";

  # Do not cach anything
  set req.hash_always_miss = true;
}

sub vcl_backend_fetch {

}

sub vcl_backend_response {
# Enable ESI processing
  if ((beresp.http.Surrogate-Control ~ "ESI/1.0") && (beresp.http.Content-Type ~ "html") && (bereq.url !~ "esi=off")) {
    unset beresp.http.Surrogate-Control;
    set beresp.do_esi = true;
    set beresp.ttl = 0s;
  }
}
*/});


module.exports = function (config) {
  config.backendMappings.unshift({
      host: '127.0.0.1',
      port: config.sphynxPort,
      name: 'backend1',
      mapPort: true
    });
    config.backendMappings = config.backendMappings.map(function (backend, index) {
    backend.name = 'backend' + (index + 1);
    return backend;
  });
  var backendsString = config.backendMappings.map(function (backend) {
    return template(backendTemplate, {
      name: backend.name,
      host: backend.port ? '127.0.0.1' : backend.host,
      port: backend.port || 80
    });
  }).join('\n');

  config.backendMappings.unshift({
      host: 'localhost',
      port: config.site.port,
      name: 'backend1',
      mapPort: true
    },{
      host: '127.0.0.1',
      port: config.site.port,
      name: 'backend1',
      mapPort: true
    },{
      host: config.ip,
      port: config.site.port,
      name: 'backend1',
      mapPort: true
    });
  var backendHints = config.backendMappings
    .map(function (backend) {
      return template(backend.mapPort ? backendHintPortTemplate : backendHintTemplate, {
        name: backend.name,
        host: backend.host,
        port: backend.port || 80
      });
    }).join('\n');

  config.vcl = template(vclTemplate, {
    backends: backendsString,
    backendHints: backendHints
  });

  return config;
};
