/**
 * Created by davidcavajimenez on 25/10/16.
 */
'use strict';

/*Módulo de seguridad, se encgar de validar que el token
  es correcto. Si fuese incorrecto devuelve un 403, permite el acceso a dos
  rutas públicas.
 */
var jwt = require('jsonwebtoken');
var managerError = require('./ErrorManager');
//Acceso al fichero de propiedades
let properties = require('properties-reader')(__dirname +'/../config/application.properties');


var mySecurityEnviorement = function (req, res, next) {

    /*Sitios públicos, no se requiere token de sesion para estas
      direcciones.
     */
    if( req.originalUrl.endsWith('/usuarios/authenticate') ||
            req.originalUrl.endsWith('/usuarios/add')  )
        return next();

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, properties.get( 'security.private.key' ), function(err, decoded) {
            if (err) {
                return res.json( managerError( req , 401, 'HTTP_401_UNAUTHORIZED') );
            } else {
                // Salvamos el token en decodificado, por si hay que tratarlo en otras rutas.
                req.decoded = decoded;
                next();
            }
        });

    } else {
        // Devolvemos un 403 prohibiendo el acceso
        return res.status(403).json(
            managerError( req , 403, 'HTTP_403_FORBIDDEN')
        );

    }

};

module.exports = mySecurityEnviorement;
