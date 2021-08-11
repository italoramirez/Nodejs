const express = require('express');
const morgan = require('morgan');
// const Joi = require('joi');
const config = require('config');
const debug = require('debug')('app:inicio');
const usuarios = require('./routes/usuarios');
// const dbDebug = require('debug')('app:database');
// const logger = require('./logger');

const app = express();

//middleware
app.use(express.json());//body



/* Configuración de entornos */
/* para cambiar a producción export NODE_ENV=production en la consola */
console.log('La aplicación: ' + config.get('nombre'));
console.log('BD server: ' + config.get('configDb.host'));

/* Codifica la url y la formatea en json 
    envíos desde el formulario
*/

/* middleware de terceros Morgan */
/* 
    sirve para medir tiempos de petición y para ver la petición http
*/
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    // console.log('morgan habilitado');
    debug('Morgan está habilitado');
}

//Trabajos con la DB  debug export DEBUG=app:inicio
debug('Conectando con las base de datos');

/* urlencode */
app.use(express.urlencoded({ extended: true }));

//para publicar imagenes estáticas o archivos cuando se tiene almacenadas en el servidor
app.use(express.static('public'));


/* middelware */
// app.use(logger);

app.use('/api/usuarios', usuarios);

//creamos una variable de entorno con export PORT=5000
/* Le decimos que si la variable de entorno está ocupada, entonces que tome la 3000 */
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`)
});

