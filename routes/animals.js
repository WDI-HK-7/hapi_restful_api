// https://github.com/hapijs/joi
var Joi = require('joi');


exports.register = function(server, options, next) {
  // Declaring routes here
  server.route([
    // INDEX METHOD
    {
      method: 'GET',
      path: '/',
      handler: function (request, reply) {

        console.log('[GET]    ' + server.info.uri + '/');
        reply("hi there, welcome to my ANIMALS API!");

      }
    },
    // LIST ALL THE ANIMALS
    {
      method: 'GET',
      path: '/animals',
      handler: function (request, reply) {

        console.log('[GET]    ' + server.info.uri + '/mongo');

        var db   = request.server.plugins['hapi-mongodb'].db;
        
        db.collection('animals').find().toArray(function(err, result) {
          if (err) return reply('Internal MongoDB error', err);
          console.log( result );
          reply( result );
        });
      }
    },
    // GET A RANDOM ANIMAL
    {
      method: 'GET',
      path: '/animals/random',
      handler: function (request, reply) {

        console.log('[GET]    ' + server.info.uri + '/animals/random');

        var db   = request.server.plugins['hapi-mongodb'].db;
        
        db.collection('animals').find().toArray(function(err, result) {
          if (err) return reply('Internal MongoDB error', err);
          console.log( result );

          var id = Math.floor(Math.random() * result.length);
          reply( result[id] );
        });
      }
    },
    // GET A PARTICULAR ANIMAL
    {
      method: 'GET',
      path: '/animals/{id}',
      handler: function (request, reply) {

        console.log('[GET]    ' + server.info.uri + '/animals/' + request.params.id);

        var id = encodeURIComponent(request.params.id)

        var db   = request.server.plugins['hapi-mongodb'].db;
        var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;
        
        db.collection('animals').findOne({ "_id": ObjectId(id)}, function(err, result) {
          if (err) return reply('Internal MongoDB error', err);
          console.log( result );
          reply( result );
        });
      }
    },
    // CREATE A NEW ANIMAL
    {
      method: 'POST',
      path: '/animals',
      config: {

        handler: function(request, reply) {
          console.log('[POST]   ' + server.info.uri + '/animals/' );

          var animal = {
            name: request.payload.animal.name,
            sound: request.payload.animal.sound
          };

          var db = request.server.plugins['hapi-mongodb'].db;

          db.collection('animals').insert(animal, function (err, doc){
            if (err) {
              return reply(Hapi.error.internal('Internal MongoDB error', err));
            } else {
              reply(doc);
            }
          });
        },

        // https://github.com/hapijs/joi
        validate: {
          payload: {
            animal: {
              name: Joi.string().required(),
              sound: Joi.string().required()
            }
          }
        }
      }
    },
    // DELETE AN ANIMAL
    {
      method: 'DELETE',
      path: '/animals/{id}',
      handler: function(request, reply) {
        console.log('[DELETE] ' + server.info.uri + '/animals/' + request.params.id );

        if (animals.length <= request.params.id) {
           return reply('No animal found!!').code(404);
        }
        
        var id = encodeURIComponent(request.params.id)

        var db   = request.server.plugins['hapi-mongodb'].db;
        var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;
        
        db.collection('animals').remove({ "_id": ObjectId(id)}, function(err, result) {
          if (err) return reply('Internal MongoDB error', err);
          console.log( result );
          reply( result );
        });
      }
    }
  ]);

  next();
}

exports.register.attributes = {
  name: 'animals-route',
  version: '1.0.0'
};