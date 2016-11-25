'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();


//Función Genérica de tratamiento de errores
var errorMiddleWare =  function( err, req, res, next ) {
  if ( Error.prototype.isPrototypeOf( err ) ){
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err });
  } else{
    res.json ( err );
  }
};


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// eliminamos la cabecera de respuesta de express
app.set('x-powered-by',false);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(require('./modules/Security'));

require('./bbdd/mongooseConnection');

/*Le indicamos el número de espacios en las respuestas
 *json para que pinte el json bien presentado ( pretty ).
 */
app.set('json spaces', 2);
// cargo los modelos
require('./models/Anuncios');
require('./models/Usuarios');

/*Rutas propias */
app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios') );
app.use('/apiv1/usuarios', require('./routes/apiv1/usuarios') );

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use( errorMiddleWare  );
}

// production error handler
// no stacktraces leaked to user
app.use( errorMiddleWare );



module.exports = app;
