const express = require('express');
const jwt = require('jsonwebtoken');
const verificarToken = require('../middlewares/auth')
const config = require('config');
const bcrypt = require('bcrypt');
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

/* Se separa el middleware a su propia capa */
// let verificarToken = (req, res, next) => {
//     let token = req.get('Authorization');
//     jwt.verify(token, config.get('configToken.SEED'), (err, decoded) => {
//         if (err) {
//             return res.status(401).json({
//                 err
//             })
//         }
//         // res.send(token);
//         req.usuario = decoded.usuario;
//         next();
//     });
// }

ruta.get('/', verificarToken, (req, res) => {
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

    Usuario.findOne({ email: body.email }, (err, user) => {
        if (err) {
            return res.status(400).json({ error: 'Server error' });
        }
        if (user) {
            return res.status(400).json({ msj: 'Usuario existe' })
        }
    });
    //validate
    const { error, value } = schema.validate({ nombre: body.nombre, email: body.email });
    if (!error) {
        let resultado = crearUsuario(body);
        resultado.then(user => {
            res.json({
                nombre: user.nombre,
                email: user.email
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


ruta.put('/:email', verificarToken, (req, res) => {
    //validate
    const { error, value } = schema.validate({ nombre: req.body.nombre });

    if (!error) {
        let resultado = actualizarUsuarios(req.params.email, req.body);
        resultado.then(valor => {
            res.json({
                nombre: valor.nombre,
                email: valor.email
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

ruta.delete('/:email', verificarToken, (req, res) => {
    let resultado = desactivarUsuario(req.params.email);
    resultado.then(valor => {
        res.json({
            nombre: valor.nombre,
            email: valor.email
        })
    }).catch(err => {
        res.status(400).json({
            err
        })
    });
});

async function listarUsuarioActivos() {
    let usuarios = await Usuario.find({ "estado": true })
        .select({ nombre: 1, email: 1 });
    return usuarios;
}

async function crearUsuario(body) {
    let usuario = new Usuario({
        email: body.email,
        nombre: body.nombre,
        password: bcrypt.hashSync(body.password, 10)
    });
    return await usuario.save();
}

async function actualizarUsuarios(email, body) {
    let usuario = await Usuario.findOneAndUpdate({ "email": email }, {
        $set: {
            nombre: body.nombre,
            password: bcrypt.hashSync(body.password, 10)
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