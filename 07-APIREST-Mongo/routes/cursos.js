const express = require('express');
const verificarToken = require('../middlewares/auth');
const Libro = require('../models/curso_model');
const ruta = express.Router();

ruta.get('/', verificarToken, (req, res) => {
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

ruta.post('/', verificarToken, (req, res) => {
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

});

ruta.put('/:id', verificarToken, (req, res) => {

    let result = actualizarCurso(req.params.id, req.body);
    result.then(respuesta => {
        res.json(respuesta)
    }).catch(err => {
        res.status(400).json(err);
    })
})

ruta.delete('/:id', verificarToken, (req, res) => {
    let resul = desactivarCurso(req.params.id)
    resul.then(response => {
        res.json(response);
    }).catch(err => { res.json(err) })
})



async function listarCursos() {
    let cursos = await Libro.find({ "estado": true });
    return cursos;
}

async function crearCurso(body) {
    let curso = new Libro({
        titulo: body.titulo,
        descripcion: body.descripcion
    });
    return await curso.save();
}

async function actualizarCurso(id, body) {
    let curso = await Libro.findByIdAndUpdate(id, {
        $set: {
            titulo: body.titulo,
            descripcion: body.descripcion,
        }
    }, { new: true });
    return curso;
}

async function desactivarCurso(id) {
    let curso = await Libro.findByIdAndUpdate(id, {
        $set: {
            estado: false
        }
    }, { new: true });
    return curso;
}


module.exports = ruta;