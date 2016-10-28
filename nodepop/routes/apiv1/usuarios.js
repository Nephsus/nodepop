/**
 * Created by davidcavajimenez on 24/10/16.
 */
"use strict";


var express = require('express');
var router = express.Router();
let success = require('../../modules/Success');
let sha256 = require('sha256');
let emailValidator = require('email-validator');

var jwt = require('jsonwebtoken');

var managerError = require('../../modules/ErrorManager');

var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuarios');
//Acceso al fichero de propiedades
let properties = require('properties-reader')(__dirname +'/../../config/application.properties');


router.post('/authenticate', function(req, res, next) {

    //Validamos que ambos campos vengan rellenos

    var usuario =  req.body ;

    if(typeof usuario.clave === 'undefined'  || usuario.clave.trim() === '')
        return next( managerError( req , 'A02', 'APPLICATION_ERR_A02')  );
    if(typeof usuario.email === 'undefined'  || usuario.email.trim() === '')
        return next( managerError( req , 'A03', 'APPLICATION_ERR_A03')  );

    emailValidator.validate_async(usuario.email , function(err, isValidEmail) {
        if( isValidEmail ) {
            //Encriptamos la clave
            usuario.clave = sha256(usuario.clave);

            Usuario.findOne(usuario, function (err, usuario) {
                if (err)
                    return next(managerError(req, 999, 'APPLICATION_ERR_GENERIC'));

                if (usuario === null)
                    return next(managerError(req, 'A05', 'APPLICATION_ERR_A05'));

                let token = jwt.sign({email: usuario.email}, properties.get( 'security.private.key' ), {
                    expiresIn: '2 days'
                });

                res.json(token);
            });
        }else{
            return next( managerError( req , 'A03', 'APPLICATION_ERR_A03')  );
        }
    });

});



router.post('/add', function(req, res, next) {

    /**Cogemos los parámetros, validamos cada uno y damos de alta **/

    var usuario = new Usuario( req.body );

    //Validaciones
    //Ningún campo venga vacío o a espacios
    if(typeof usuario.nombre === 'undefined' || usuario.nombre.trim() === '')
        return next( managerError( req , 'A01', 'APPLICATION_ERR_A01')  );
    if(typeof usuario.clave === 'undefined'  || usuario.clave.trim() === '')
        return next( managerError( req , 'A02', 'APPLICATION_ERR_A02')  );
    if(typeof usuario.email === 'undefined'  || usuario.email.trim() === '')
        return next( managerError( req , 'A03', 'APPLICATION_ERR_A03')  );



    emailValidator.validate_async(usuario.email , function(err, isValidEmail) {
        if( isValidEmail ) {
            //Comprobamos que no haya un email previo dado de alta
            Usuario.count({email: usuario.email}, function (err, count) {

                if (count > 0 || err) {
                    return next(managerError(req, 'A04', 'APPLICATION_ERR_A04'));
                }
                //Encripto la clave
                usuario.clave = sha256(usuario.clave);
                //Y guardamos
                usuario.save(function (err) {
                    if (err)
                        return next(managerError(req, 999, 'APPLICATION_ERR_GENERIC'));
                    else
                        res.json(success.successResponse());
                });
            });


        }else{
            return next( managerError( req , 'A03', 'APPLICATION_ERR_A03')  );
        }
    });

});




module.exports = router;