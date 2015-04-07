var Hapi = require('hapi');

var server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: 8000,
  routes: {cors: true}
});

var plugins = [
  {
    register: require('./routes/animals.js')
  },
  {
    // https://www.npmjs.com/package/hapi-mongodb
    register: require('hapi-mongodb'),
    options: { "url": "mongodb://127.0.0.1:27017/db_wdi", "settings": {"db":{"native_parser": false }}}
  }
];

server.register(plugins, function (err) {
  if (err) { throw err; }

  server.start(function () {
    console.log('info', 'Server running at: ' + server.info.uri);
  });
});
