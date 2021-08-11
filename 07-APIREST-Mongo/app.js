const usuarios = require('./routes/usuarios');
const cursos = require('./routes/cursos');
const auth = require('./routes/auth');
const express = require('express');
const mongoose = require('mongoose');



mongoose.connect('mongodb://localhost:27017/demo', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log('Conectado a mongo'))
    .catch(err => console.log('Error' + err))

//instance
const app = express();
/* Devuelve los datos en json  */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/usuarios', usuarios);
app.use('/api/cursos', cursos);
app.use('/api/auth', auth);


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('ApiRestFul...corriendo');
})