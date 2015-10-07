'use strict';

var path = require('path');
var hapi = require('hapi');

var DIST_DIR = path.join(__dirname, '..', 'dist');

var server = new hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: path.join(__dirname, '..', 'public')
      }
    }
  }
});

server.connection({
  port: 3001,
  host: 'localhost'
});

server.route({
  method: 'GET',
  path: '/pubfood.{ext}',
  handler: function routeHandler(request, reply) {
    if (request.params.ext === 'js') {
      reply.file(path.join(DIST_DIR, 'pubfood.js'));
      return;
    }
    if (request.params.ext === 'min.js') {
      reply.file(path.join(DIST_DIR, 'pubfood.min.js'));
      return;
    }
    reply({statusCode: 404, error: 'Not Found'}).code(404);
  }
});

server.route({
  method: 'GET',
  path: '/simulated-provider/{provider}',
  handler: function routeHandler(request, reply) {
    var DEFAULT_DELAY = 20;
    var DEFAULT_FUZZ = 10;
    var parsedDelay = parseInt(request.query.delay, 0);
    var delay = isFinite(parsedDelay) ? parsedDelay : DEFAULT_DELAY;
    var parsedFuzz = parseInt(request.query.fuzz, 0);
    var fuzz = isFinite(parsedFuzz) ? parsedFuzz : DEFAULT_FUZZ;
    var actualDelay = Math.round(delay + ((2 * Math.random() - 1) * fuzz), 3);
    console.log([
      'Delaying simulated provider',
      request.params.provider,
      'by:',
      actualDelay + 'ms'].join(' '));
    setTimeout(function() {
      reply([
        request.query.global,
        '.',
        request.params.provider,
        '=',
        '"the:good:stuff"'].join(''));
    }, actualDelay);
  }
});

server.register([{
  register: require('inert')
}], function(err) {
  if (err) {
    console.log('Failed to load inert');
  }
  // do static serving out of the public directory
  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true,
        index: true
      }
    }
  });
  server.start(function() {
    console.log('Server started at:');
    console.log(server.info.uri);
  });
});