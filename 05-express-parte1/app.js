const express = require('express');

const app = express();

const usuarios = [
    {id: 1, nombre: 'italo'},
    {id: 2, nombre: 'marcela'},
    {id: 3, nombre: 'Pipe'},
    {id: 4, nombre: 'Gabo'},
];

app.get('/', (req, res) => {
    res.send('Hola mundo desde express'); 
}); //petición

app.get('/api/usuarios', (req, res) => {
    res.send(['italo', 'luis', 'marcela']);
})

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

    let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    if (!usuario) res.status(404).send('El ususario no fue encontrado');
    res.send(usuario);


})

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`)
});

// app.post(); //envío de datos
// app.put(); //actualización
// app.delete(); //eliminación