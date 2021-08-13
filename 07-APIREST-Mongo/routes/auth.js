const express = require('express');
const config = require('config')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario_model');
// const Joi = require('joi');
const ruta = express.Router();

ruta.post('/', (req, res) => {
    Usuario.findOne({
        email: req.body.email
    }).then(datos => {
        if (datos) {
            const passwordValidate = bcrypt.compareSync(req.body.password, datos.password);
            if (!passwordValidate) {
                return res.status(400).json({ error: 'ok', msj: 'Usuario o contraseña incorrecta ' });
            }
            const jwToken = jwt.sign({
                data: { _id: datos._id, nombre: datos.nombre, email: datos.email },
            }, config.get('configToken.SEED'), { expiresIn: config.get('configToken.expiration') });
            /* Antes de guardar el token en el server */
            // }, 'secret', { expiresIn: /* 60 * 60 */ '24h' });
            res.json({
                usuario: {
                    _id: datos._id,
                    nobre: datos.nombre,
                    eail: datos.email
                },
                jwToken: jwToken,
            });

            /* Fora de validar */
            // const jwToken = jwt.sign({
            //     _id: datos._id,
            //     nombre: datos.nombre,
            //     email: datos.email
            // }, 'password');

            // res.send(jwToken);
            // res.json({ datos });
        } else {
            res.status(400).json({
                err: 'ok',
                msj: 'Usuario o contraseña incorrecta'
            })
        }
    })
        .catch(err => {
            res.status(400).json({
                error: 'ok',
                msj: 'Error en el servicio ' + err
            })
        })
})


module.exports = ruta;