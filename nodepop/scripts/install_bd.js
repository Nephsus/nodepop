/**
 * Created by davidcavajimenez on 24/10/16.
 */
'use strict';

var mongodb = require('mongodb');
var fs      = require('fs');
var async   = require('async');
let sha256  = require('sha256');

//Acceso al fichero de propiedades
let properties = require('properties-reader')(__dirname +'/../config/application.properties');

var client  = mongodb.MongoClient;

client.connect( properties.get( 'bbdd.connection.string' ), function(err, db) {
    if (err) {
        return console.log('Error', err);
    }

    fs.readFile(__dirname +'/anuncios.json', 'utf8', function (err, data) {
        if (err) return console.log('Error read file initialization: ', err);
        /*Parseamos el objeto a json */
        var advertisements = JSON.parse(data);
        console.log('Leo el fichero de texto');
        insertAdvertisements( db, advertisements,  function ( ) {
            console.log('Conexión cerrada');
            db.close();
        });

    });


});



var insertAdvertisements = function(db, advertisements, callback) {



    var anuncios = db.collection('anuncios');
    /*primero inicializalos primero la tabla */
    anuncios.drop();

    async.each( advertisements.anuncios , function (anuncio, next) {
        console.log('Inserto Anuncio');
        anuncios.insertOne( anuncio );
        next();
    }, function (err) {
        if(err) return console.log('Error load advertisements:', err);
        insertUser(db, callback);
    });

};

var insertUser = function(db, callback) {

    var usuarios = db.collection('usuarios');
    /*Inicializamos primero la tabla */
    usuarios.drop();

    usuarios.createIndex( { email: 1 } );
    /*cargamos los anuncios */
    usuarios.insertOne(
        {
            'nombre': 'David',
            'email': 'prueba@hotmail.com',
            'clave': sha256('prueba')
        },
     function(err, result) {
        console.log('Inserted ' + result.ops.length +   ' into the users collection');
        callback(result);
    });



};
