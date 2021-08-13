/* realciones por feferencia normalización*/
let usuario = {
    id: '001',
    nombre: 'Italo',
    email: 'me@example.com'
}


let curso = {
    id: 'C001',
    id_alumnos: ['U001', 'U002', 'U003'],
    titulo: 'JavaScript Moderno',
    descripcion: 'xxx'
}

/* Realciones por documentos embebidos (desnormalización)*/

let curso = {
    id: 'C001',
    autor: {
        nombre: 'Italo',
    },
    id_alumnos:
        [
            { id: '001', nombre: 'Italo', email: 'me@example.com' },
            { id: '002', nombre: 'Marcela', email: 'ma@example.com' }
        ],
    titulo: 'JavaScript Moderno',
    descripcion: 'xxx'
}


/* realcional */
// let curso_alumno = {
//     id: '001',
//     id_curso: 'C001',
//     id_alumno: 'A001'
// }