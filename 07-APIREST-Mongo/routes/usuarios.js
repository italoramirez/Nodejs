const express = require('express');
const Usuario = require('../models/usuario_model');
const Joi = require('joi');
const ruta = express.Router();

const schema = Joi.object({
    nombre: Joi.string()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});

ruta.get('/', (req, res) => {
    let resultado = listarUsuarioActivos();
    resultado.then(usuarios => {
        res.json(usuarios)
    }).catch(err => {
        res.status(400).json({
            error: err
        })
    })
});


ruta.post('/', (req, res) => {
    let body = req.body;
    //validate
    const { error, value } = schema.validate({ nombre: body.nombre, email: body.email });
    if (!error) {
        let resultado = crearUsuario(body);
        resultado.then(user => {
            res.json({
                valor: user,
            });
        }).catch(err => {
            res.status(400).json({
                error: err
            })
        });
    } else {
        res.status(400).json({
            error: error
        })
    }

})


ruta.put('/:email', (req, res) => {
    //validate
    const { error, value } = schema.validate({ nombre: req.body.nombre });

    if (!error) {
        let resultado = actualizarUsuarios(req.params.email, req.body);
        resultado.then(valor => {
            res.json({
                reponse: valor
            })
        }).catch(err => {
            res.status(400).json({
                err: err
            })
        })
    } else {
        res.status(400).json({
            error: error
        })
    }
})

ruta.delete('/:email', (req, res) => {
    let resultado = desactivarUsuario(req.params.email);
    resultado.then(valor => {
        res.json({
            usuario: valor
        })
    }).catch(err => {
        res.status(400).json({
            err
        })
    });
});

async function listarUsuarioActivos() {
    let usuarios = await Usuario.find({ "estado": true });
    return usuarios;
}

async function crearUsuario(body) {
    let usuario = new Usuario({
        email: body.email,
        nombre: body.nombre,
        password: body.password
    });
    return await usuario.save();
}

async function actualizarUsuarios(email, body) {
    let usuario = await Usuario.findOneAndUpdate({ "email": email }, {
        $set: {
            nombre: body.nombre,
            password: body.password,
        }
    }, { new: true })
    return usuario;
}

async function desactivarUsuario(email) {
    let usuario = await Usuario.findOneAndUpdate({ "email": email }, {
        $set: {
            estado: false
        }
    }, { new: true });
    return usuario;
}
module.exports = ruta;