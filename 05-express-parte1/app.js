const express = require('express');
const morgan = require('morgan');
const Joi = require('joi');
// const logger = require('./logger');

const app = express();

//middleware
app.use(express.json());//body

/* Codifica la url y la formatea en json 
    envíos desde el formulario
*/

/* middleware de terceros Morgan */
/* 
    sirve para medir tiempos de petición y para ver la petición http
*/
app.use(morgan('tiny'));
console.log('morgan ahabilitado');


/* urlencode */
app.use(express.urlencoded({ extended: true }));

//para publicar imagenes estáticas o archivos cuando se tiene almacenadas en el servidor
app.use(express.static('public'));


/* middelware */
// app.use(logger);

// app.use(function (req, res, next) {
//     console.log('autenticando');
//     next();
// })

const usuarios = [
    { id: 1, nombre: 'italo' },
    { id: 2, nombre: 'marcela' },
    { id: 3, nombre: 'Pipe' },
    { id: 4, nombre: 'Gabo' },
];

app.get('/', (req, res) => {
    res.send('Hola mundo desde express');
}); //petición

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
});

app.post('/api/usuarios', (req, res) => {

    /* URLencode */
    // let body = req.body;
    // console.log(body.nombre);
    // res.json({
    //     body
    // });

    const schema = Joi.object({
        nombre: Joi.string()
            .min(3)
            .required(),
    });

    const { error, value } = validarUsuario(req.body.nombre);

    if (!error) {

        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        };
        usuarios.push(usuario);
        res.send(usuario);

    } else {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje)
    }

});


app.put('/api/usuarios/:id', (req, res) => {
    //Encontrar si existe el usuario
    // let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    let usuario = existeUsuario(req.params.id)
    if (!usuario) {
        res.status(404).send('El ususario no fue encontrado');
        return;
    }

    const { error, value } = validarUsuario(req.body.nombre);

    if (error) {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }
    usuario.nombre = value.nombre;
    res.send(usuario);

});

app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id)
    if (!usuario) {
        res.status(404).send('El ususario no fue encontrado');
        return;
    }

    const index = usuarios.indexOf(usuario);
    /* SE debe colocar 1 o si no borra todo el arreglo de obj */
    usuarios.splice(index, 1);
    res.send(usuarios);
});

//creamos una variable de entorno con export PORT=5000
/* Le decimos que si la variable de entorno está ocupada, entonces que tome la 3000 */
const port = process.env.PORT || 3000;

/* Ruta con parametrización */
// app.get('/api/usuarios/:year/:mes', (req, res) => {
app.get('/api/usuarios/:id', (req, res) => {
    /* Cuando es de un solo parámetro */
    // res.send(req.params.id);

    /* Cuando son dos parámetros */
    // http://localhost:5000/api/usuarios/1983/09
    // res.send(req.params);

    /* Cuando son múltiples parámetros */
    // res.send(req.query);

    let usuario = validarUsuario(req.params.id);
    if (!usuario) res.status(404).send('El ususario no fue encontrado');
    res.send(usuario);


})

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`)
});

function existeUsuario(id) {
    return (usuarios.find(u => u.id === parseInt(id)));
}

function validarUsuario(nom) {
    const schema = Joi.object({
        nombre: Joi.string()
            .min(3)
            .required(),
    });
    return schema.validate({ nombre: nom });
}

// app.post(); //envío de datos
// app.put(); //actualización
// app.delete(); //eliminación