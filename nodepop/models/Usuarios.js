/**
 * Created by davidcavajimenez on 24/10/16.
 */
'use strict';


var mongoose = require('mongoose');

//Definimos el modelo de usuario
var usuarioSchema = mongoose.Schema({
    nombre: String,
    email: String,
    clave: String
});


mongoose.model('Usuarios', usuarioSchema);