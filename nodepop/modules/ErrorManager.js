/**
 * Created by davidcavajimenez on 26/10/16.
 */
'use strict';


/* Módulo de seguridad para el manejo de errores,
   devuelve objetos CustomError traducidos al idios correspondiente.
 */

//Carmos el modulo de locales para el multiidioma
var I18n = require('i18n-node');
var i18n = new I18n({
    directory: __dirname + '/../locales/'
});

var CustomError =  require('../models/CustomError');

let managerError = function ( req, code, message ) {

    /*Tomamos como lenguaje por defecto el español
    si no encontramos el parámetro 'lang'
    en el body ó en el url o en la cabecera
    x-lang-user.*/

    var language = 'es';
    if ( req ) {
        language = req.body.lang ||
            req.query.lang ||
            req.headers['x-lang-user'] || 'es';
    }

    /*Buscamos en el locale correspondiente la traducción del error*/
    let textTranslate = i18n.t( language , message , { });
    return new CustomError(false, code, textTranslate);

};

module.exports = managerError;
 