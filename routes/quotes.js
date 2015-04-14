exports.register = function(server, options, next) {

  // here will go our routes for the API
  server.route([
    { //  HELLO WORLD
      method: 'GET',
      path: '/',
      handler: function (request, reply) {
        reply("Hello, I'm an awesome HarryQuote API Server!!");
      }
    },
    { // GET ALL THE QUOTES
      method: 'GET',
      path: '/quotes',
      handler: function (request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
        db.collection('quotes').find().toArray(function(err, result){
          if (err) throw err;
          reply(result);
        });
      }
    },
    { // GET RANDOM QUOTES
      method: 'GET',
      path: '/quotes/random',
      handler: function (request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
        db.collection('quotes').find().toArray(function(err, result){
          if (err) throw err;
          var randomIndex = Math.floor(Math.random() * result.length)
          reply(result[randomIndex]);
        });
      }
    },
    { //  GET ONE QUOTE
      method: 'GET',
      path : '/quotes/{id}',
      handler: function (request, reply) {
        var id = encodeURIComponent(request.params.id);
        var db       = request.server.plugins['hapi-mongodb'].db;
        var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;

        db.collection('quotes').findOne( {"_id" : ObjectID(id)}, function(err, quote){
          if (err) throw err;
          reply(quote);
        })
      }
    },
    { //  DELETE ONE QUOTE
      method: 'DELETE',
      path : '/quotes/{id}',
      handler: function (request, reply) {
        var id = encodeURIComponent(request.params.id);
        var db       = request.server.plugins['hapi-mongodb'].db;
        var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;

        db.collection('quotes').remove({"_id" : ObjectID(id)}, function(err, writeResult){
          if (err) throw err;

          reply(writeResult);
        })
      }
    },
    { //  UPDATE ONE QUOTE
      method: 'PUT',
      path : '/quotes/{id}',
      handler: function (request, reply) {
        var id = encodeURIComponent(request.params.id);
        var db       = request.server.plugins['hapi-mongodb'].db;
        var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
        var newQuote = request.payload.quote;

        db.collection('quotes').update({"_id" : ObjectID(id)}, newQuote, function(err, writeResult){
          if (err) throw err;

          reply(writeResult);
        })
      }
    },
    { //  POST ==> Adds a new quote to our collection
      method: 'POST',
      path: '/quotes',
      handler: function (request, reply) {
        var newQuote = request.payload.quote;
        var db       = request.server.plugins['hapi-mongodb'].db;
        db.collection('quotes').insert( newQuote, function(err, writeResult ){
          if (err) {
            return reply(Hapi.error.internal('Internal MongoDB Error', err));
          } else {
            reply(writeResult);
          }
        })
      }
    },
    { // SEARCH QUOTES
      method: 'GET',
      path: '/quotes/search/{searchQuery}',
      handler: function (request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
        var query = { "$text": { "$search": request.params.searchQuery} };

        db.collection('quotes').find(query).toArray(function(err, result){
          if (err) throw err;
          reply(result);
        });
      }
    }
  ])

  next();
}

exports.register.attributes = {
  name: 'quotes-route',
  version: '0.0.1'
}