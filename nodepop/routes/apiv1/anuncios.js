'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Anuncios = mongoose.model('Anuncios');

var async   = require('async');
let url = require('url');
let path = require('path');

//Validador de ObjectId
var ObjectId = require('mongoose').Types.ObjectId;

var managerError = require('../../modules/ErrorManager');

//Acceso al fichero de propiedades
let properties = require('properties-reader')(__dirname +'/../../config/application.properties');

/*Cargamos un map con los filtros de precio*/
var filterMapPrice = new Map();
filterMapPrice.set('10-50', { $gte: 10, $lte: 50 });
filterMapPrice.set('10-', { $gte: 10 } );
filterMapPrice.set('-50',{ $lte:  50 } );
filterMapPrice.set('50',  50 );


/* GET users listing. */
router.get('/', function(req, res, next) {
  //Construimos el filtro para la query
  var filter = {};

  var tag = req.query.tag;
  var venta = req.query.venta;
  var precio = req.query.precio;
  var nombre = req.query.nombre;
  /*id del útimo objeto devuelto, lo usamos para paginar,
    también lo podemos hacer con skip y limit, pero el id es
    mucho más rapido. La app tan sólo tendría que enviarlo.
   */
  var _id = req.query._id;

  //Validamos
  if (typeof tag !== 'undefined') {
    filter.tags = tag;
  }
  //Validamos
  if (typeof venta !== 'undefined') {
    filter.venta = venta;
  }
  //Validamos
  if (typeof precio !== 'undefined' &&
          typeof filterMapPrice.get(precio)  !== 'undefined' ) {
    filter.precio = filterMapPrice.get(precio);
  }
  //Validamos
  if (typeof nombre !== 'undefined') {
    filter.nombre = new RegExp('^' + nombre, 'i');
  }

  //Componenmos el flag de paginación
  if (typeof _id !== 'undefined') {
    //Validamos de que _id es válido
    if( ! ObjectId.isValid( _id ) )
      return next( managerError( req , 'A06', 'APPLICATION_ERR_A06')  );

    filter._id = { $gt: _id};
  }

  Anuncios.list( filter, function (err, anuncios ) {

    if(err) return  next(err);

    /*Recorremos el array para cambiar el path de foto
      y añadirle el host para que cuando el usuario pinche pueda
      ver la imagen en un navegador
     */
      async.each(anuncios, function (anuncio, next) {
        anuncio.foto = path.format({dir: fullUrl(req), base: anuncio.foto});
        next();
      }, function (err) {
        if (err) return console.log('Error procesando url:', err);

        /*Incluimos un flag de paginacion
          para indicar que hay más registros y así paginar hacia adelante
          cogiendo el último _id devuelto
         */
        var moreRecords = false;
        if(anuncios!= null &&
            anuncios.length > properties.get( 'advertisements.records.page' ) ) {
             moreRecords = true;
          /*Eliminamos el último registro*/
          anuncios.pop();
        }

        res.json({ moreRecords: moreRecords, advertisements : anuncios});
      });
    });


});

/* Función que devuelve el la url completa del servidor incluyendo el puerto.
   En escenarios con cluster/proxies de por medio hay que tenerlo en cuenta, no funcionaria.
 */
function fullUrl(req) {
  return url.format({
    protocol: req.protocol,
    hostname: req.hostname ,
    pathname: 'images/anuncios',
    port: req.app.settings.port
  });
}




module.exports = router;