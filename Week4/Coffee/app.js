'use strict';

const Hapi = require('hapi');
const Blipp = require('blipp');
const Path = require('path');
const Inert = require('inert');
const Vision = require('vision');
const Handlebars = require('handlebars');

const server = new Hapi.Server({

    connections:{

        routes:{
            files:{
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }

});

server.connection({ port: 3000, host: 'localhost' });

server.register([Blipp, Inert, Vision], ()=> {});

server.views({
    engines: {
        html: Handlebars
    },
    path: 'views',
    layoutPath: 'views/layout',
    layout: 'layout',
    helpersPath: 'views/helpers'


});

server.route({
    method: 'GET',
    path: '/',
    handler:{
        view: {
            template: 'index',
            context:{
                title: 'Jeffreys coffeeshop',
                message: 'Jeffrey wakes up to early today. He wants to get some coffee, so he will not fall asleep in class. Which kind of coffee should he choose??????????????????',
                pic:'/images/CoffeeShop.jpg',
                nav: [
                    {
                        url: "/page2/mocha",
                        title: "mocha"
                    },
                    {
                        url: "/page2/latte",
                        title: "latte"
                    },
                    {
                        url: "/page2/macchiato",
                        title: "macchiato"
                    },

                ],
            
            }
        }
    }
});

server.route({
    method: 'GET',
    path: '/page2/{var}',
    handler: function (request, reply) {
        reply.view('index2', {
            title: 'Jeffreys coffeeshop',
            message: 'Jeffrey decides to get some  ' + request.params.var  + ' now he decides how much sugar he needs for his ' + request.params.var ,
            pic:'/images/' + request.params.var + '.jpg',
            nav: [
                {
                    url: "/page2/" + request.params.var  + "/80",
                    title: "80%"
                },
                {
                    url: "/page2/" + request.params.var + "/50",
                    title: "50%"
                },
                {
                    url: "/page2/" + request.params.var  + "/20",
                    title: "20%"
                },

            ],

        });
    }
});

server.route({
    method: 'GET',
    path: '/page2/{var}/{var1}',
    handler: function (request, reply) {
        reply.view('index3', {
            title: 'Jeffreys coffeeshop',
            message: 'after choosing' +  request.params.var1  + '  % sugar Jeffrey also wants some milk, so he says what to seller'  ,
            pic:'/images/' + request.params.var1 + '.jpg',
            nav: [
                {
                    url: "/page2/" + request.params.var  + "/" + request.params.var1  + "/yes",
                    title: "yes"
                },
                {
                    url: "/page2/" + request.params.var  + "/" + request.params.var1  + "/no",
                    title: "no"
                },
                {
                    url: "/page2/" + request.params.var  + "/" +  request.params.var1  + "/maybe",
                    title: "maybe"
                },

            ],

        });
    }
});

server.route({
    method: 'GET',
    path: '/page2/{var}/{var1}/{var2}',
    handler: function (request, reply) {
        reply.view('index4', {
            title: 'Jeffreys coffeeshop',
            message: 'finally jeffrey says "' +  request.params.var2  + ' " and he gets his ' +  request.params.var,
            pic:'/images/' + request.params.var2 + '.jpg',
         });
    }
});


server.route({
    method: 'GET',
    path: '/{param*}',
    handler:{
        directory:{
            path: './',
            listing: true,
            index: false,
            redirectToSlash: true
        }
    }
});




server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
