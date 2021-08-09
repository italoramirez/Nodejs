const usuarios = require('./routes/usuarios')
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


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('ApiRestFul...corriendo');
})