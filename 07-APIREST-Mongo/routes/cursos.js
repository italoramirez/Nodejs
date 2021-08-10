const express = require('express');
const Libro = require('../models/curso_model');
const ruta = express.Router();

ruta.get('/', (req, res) => {
    let resultado = listarCursos();
    resultado.then(course => {
        res.json({
            val: course
        });
    }).catch(err => {
        res.status(400).json({
            error: err
        });
    })
});

ruta.post('/', (req, res) => {
    // let body = req.body;
    // const { error, value } = 
    let resul = crearCurso(req.body);
    resul.then(val => {
        res.json({
            valor: val
        })
    }).catch(err => {
        res.status(400).json({
            error: err
        })
    });

})

async function crearCurso(body) {
    let curso = new Libro({
        titulo: body.titulo,
        descripcion: body.descripcion
    });
    return await curso.save();
}

async function listarCursos() {
    let cursos = await Libro.find({ "estado": true });
    return cursos;
}

module.exports = ruta;