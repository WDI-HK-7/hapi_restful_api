// https://github.com/hapijs/joi
var Joi = require('joi');


exports.register = function(server, options, next) {
  // This is our storage of animals
  var animals = [
    {name: 'Cat',       sound: 'meow!'},
    {name: 'Dog',       sound: 'woof!'},
    {name: 'Frog',      sound: 'squish!'},
    {name: 'Squirrel',  sound: 'munch munch munch!'}
  ];

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
    // READING FROM MONGO
    {
      method: 'GET',
      path: '/mongo',
      handler: function (request, reply) {

        console.log('[GET]    ' + server.info.uri + '/');

        var db   = request.server.plugins['hapi-mongodb'].db;
        db.collection('students').findOne({ "name": "fer" }, function(err, result) {
          if (err) return reply('Internal MongoDB error', err);
          console.log( result )
          reply( result )
        });
      }
    },
    // LIST ALL THE ANIMALS
    {
      method: 'GET',
      path: '/animals',
      handler: function (request, reply) {

        console.log('[GET]    ' + server.info.uri + '/animals');
        reply(animals); // Return all of our animals

      }
    },
    // GET A RANDOM ANIMAL
    {
      method: 'GET',
      path: '/animals/random',
      handler: function (request, reply) {

        console.log('[GET]    ' + server.info.uri + '/animals/random');

        var id = Math.floor(Math.random() * animals.length);
        reply(animals[id]);

      }
    },
    // GET A PARTICULAR ANIMAL
    {
      method: 'GET',
      path: '/animals/{id}',
      handler: function (request, reply) {

        console.log('[GET]    ' + server.info.uri + '/animals/' + request.params.id);

        // encodeURIComponent escapes all characters except the following:
        // alphabetic, decimal digits, - _ . ! ~ * ' ( )
        //
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
        var id = encodeURIComponent(request.params.id)
        reply(animals[id]);

      }
    },
    // CREATE A NEW ANIMAL
    {
      method: 'POST',
      path: '/animals',
      config: {

        handler: function(request, reply) {
          console.log('[POST]   ' + server.info.uri + '/animals/' );

          var newAnimal = request.payload.animal;
          animals.push(newAnimal);
          reply(newAnimal);
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
        animals.splice(request.params.id, 1);
        reply(true);
      }
    }
  ]);

  next();
}

exports.register.attributes = {
  name: 'animals-route',
  version: '1.0.0'
};