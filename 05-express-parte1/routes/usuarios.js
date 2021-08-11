const express = require('express');
const Joi = require('joi');
const rutas = express.Router();



const usuarios = [
    { id: 1, nombre: 'italo' },
    { id: 2, nombre: 'marcela' },
    { id: 3, nombre: 'Pipe' },
    { id: 4, nombre: 'Gabo' },
];

// rutas.get('/', (req, res) => {
//     res.send('Hola mundo desde express');
// }); //petición


// app.use(function (req, res, next) {
//     console.log('autenticando');
//     next();
// })


/* Se reemplazan las rutas por la raíz '/' porque en  el
    app.js en el middleware se pune la ruta /api/usuarios
*/
rutas.get('/', (req, res) => {
    res.send(usuarios);
});

rutas.post('/', (req, res) => {

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


rutas.put('/:id', (req, res) => {
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

rutas.delete('/:id', (req, res) => {
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

/* Ruta con parametrización */
// rutas.get('/:year/:mes', (req, res) => {
rutas.get('/:id', (req, res) => {
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

module.exports = rutas;