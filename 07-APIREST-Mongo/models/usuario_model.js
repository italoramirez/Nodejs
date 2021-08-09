const mongoose = require('mongoose');

/* Creamos el schema de curso */
const usuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    },
    imagen: {
        type: String,
        require: false
    }
});

module.exports = mongoose.model('Usuario', usuarioSchema);

