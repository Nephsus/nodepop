/**
 * Created by davidcavajimenez on 26/10/16.
 */
'use strict';

//Clase  para devolverlos errores de aplicación y lógicos.
let CustomError = function ( success, code, message ) {
    return {
            success: success,
            error: {
                code: code,
                message: message
            }
    };

};



module.exports = CustomError;

