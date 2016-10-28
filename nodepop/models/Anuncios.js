/**
 * Created by davidcavajimenez on 24/10/16.
 */
'use strict';


var mongoose = require('mongoose');
var managerError = require('../modules/ErrorManager');

//Acceso al fichero de propiedades
let properties = require('properties-reader')(__dirname +'/../config/application.properties');

// defino el esquema de los anuncios
var anuncioSchema = mongoose.Schema({
    nombre: String,
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: [String]
});

//Función que lista los anuncios de la bbdd
anuncioSchema.statics.list = function(filter, callback ) {
        let query = Anuncios.find( filter ).limit( properties.get( 'advertisements.records.page' ) + 1 ).sort({_id : 1});
        query.exec(function(err, anuncios) {
            if (err) {
                console.error('Error:', err);
                return callback(managerError( null , 999, 'APPLICATION_ERR_GENERIC'));
            }
            callback (null, anuncios );
        });
};

var Anuncios = mongoose.model('Anuncios', anuncioSchema);