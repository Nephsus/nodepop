/**
 * Created by davidcavajimenez on 24/10/16.
 */
'use strict';

var mongoose = require('mongoose');
var db = mongoose.connection;

mongoose.Promise = global.Promise;

//Acceso al fichero de propiedades
let properties = require('properties-reader')(__dirname +'/../config/application.properties');

db.on('error', console.log.bind(console));

db.once('open', function() {
    console.log('Conectado a mongodb.');
});

mongoose.connect( properties.get( 'bbdd.connection.string' ) );