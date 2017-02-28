'use strict';
const Hapi = require('hapi');
const Blipp = require('blipp');
const Vision = require('vision');
const Inert = require('inert');
const Path = require('path');
const Handlebars = require('handlebars');
const fs = require("fs");
const Sequelize = require('sequelize');

const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});

server.connection({
    port: 3000
});

var sequelize = new Sequelize('db', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }, // SQLite only
    storage: 'db.sqlite'
});

var Fans = sequelize.define('wfans', {
    fullname: {
        type: Sequelize.STRING
    },
    gender: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    cars: {
        type: Sequelize.STRING
    },
    points1: {
        type: Sequelize.STRING
    },
    points2: {
        type: Sequelize.STRING
    },
    points3: {
        type: Sequelize.STRING
    },
    points4: {
        type: Sequelize.STRING
    },
    points5: {
        type: Sequelize.STRING
    },
    points6: {
        type: Sequelize.STRING
    },
    img: {
        type: Sequelize.STRING
    },
});

server.register([Blipp, Inert, Vision], () => {});

server.views({
    engines: {
        html: Handlebars
    },
    path: 'views',
    layoutPath: 'views/layout',
    layout: 'layout',
    helpersPath: 'views/helpers', //partialsPath: 'views/partials'
});

server.route({
    method: 'GET',
    path: '/createFan',
    handler: {
        view: {
            template: 'index'
        }
    }
});

server.route({
    method: 'GET',
    path: '/',
    handler: {
        view: {
            template: 'warriorsfan'
        }
    }
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: './',
            listing: false,
            index: false
        }
    }
});

server.route({
    method: 'POST',
    path: '/form',
    handler: function (request, reply) {
        var formresponse = JSON.stringify(request.payload);
        var parsing = JSON.parse(formresponse);
        //        console.log(request.payload);

        Fans.create(parsing).then(function (Warriors) {
            Fans.sync();
            console.log("...syncing");
            console.log(Warriors);
            return (Warriors);
        }).then(function (Warriors) {

            reply.view('formresponse', {
                formresponse: Warriors
            });
        });
    }
});


server.route({
    method: 'GET',
    path: '/displayAll',
    handler: function (request, reply) {
        Fans.findAll().then(function (users) {
            // projects will be an array of all User instances
            //console.log(users[0].monsterName);
            var allUsers = JSON.stringify(users);
            reply.view('dbresponse', {
                dbresponse: allUsers
            });
        });
    }
});


server.route({
    method: 'GET',
    path: '/destroyAll',
    handler: function (request, reply) {

        Fans.drop();

        reply("destroy all");
    }
});

server.route({
    method: 'GET',
    path: '/delete/{id}',
    handler: function (request, reply) {


        Fans.destroy({
            where: {
                id: encodeURIComponent(request.params.id)
            }
        });

        reply().redirect("/displayAll");
    }
});

server.route({
    method: 'GET',
    path: '/find/{fullname}',
    handler: function (request, reply) {
        Fans.findOne({
            where: {
                fullname: encodeURIComponent(request.params.fullname),
            }
        }).then(function (user) {
            var currentUser = "";
            currentUser = JSON.stringify(user);
            //console.log(currentUser);
            currentUser = JSON.parse(currentUser);
            console.log(currentUser);
            reply.view('find', {
                dbresponse: currentUser
            });

        });
    }
});

server.route({
    method: 'GET',
    path: '/update/{id}',
    handler: function (request, reply) {
        var id = encodeURIComponent(request.params.id);


        reply.view('updatefans', {
            routeId: id
        });
    }

});

server.route({
    method: 'POST',
    path: '/update/{id}',
    handler: function (request, reply) {
        var cm = "";
        var id = encodeURIComponent(request.params.id);
        var formresponse = JSON.stringify(request.payload);
        var parsing = JSON.parse(formresponse);
        //console.log(parsing);

        Fans.update(parsing, {
            where: {
                id: id
            }
        });
        reply().redirect("/displayAll");

    }

});

server.route({
    method: 'GET',
    path: '/createDB',
    handler: function (request, reply) {
        // force: true will drop the table if it already exists
        Fans.sync({
            force: true
        });
        reply("Database Created")
    }
});
server.start((err) => {
    if (err) {
        throw err;
    }

    console.log(`Server running at: ${server.info.uri}`);
});