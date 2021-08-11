//requerimos monggose después de npm  i mongoose
const mongoose = require('mongoose');

/* Crreamos la conexión */
mongoose.connect('mongodb://localhost:27017/demo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('Connected') })
    .catch((err) => console.log(err));

/* Creamos la collection (tabla) con campos requeridos */
const cursoSchema = new mongoose.Schema({
    nombre: String,
    autor: String,
    etiquetas: [String],
    fecha: { type: Date, default: Date.now },
    publicado: Boolean
});

/* Creamos el modelo */
const Curso = mongoose.model('Curso', cursoSchema);

/* Creamos el obejeto asíncrono */
async function crearCurso() {
    const curso = new Curso({
        nombre: 'Tinker',
        autor: 'Italo',
        etiquetas: ['desarrollo web', 'front-end'],
        publicado: true
    });

    const resultado = await curso.save();
    console.log(resultado);
}
// crearCurso();

/* Listar cursos */
const numeroPagina = 2;
const sizePage = 10;
//parámetro que debe cumpril en un api => api/cursos?numeroPagina=4&sizePage=10
async function listarCurso() {
    const cursos = await Curso
        // .find({ autor: 'Italo' })
        //.find({ precio: { $gte: 10, $lte: 30 } })//comparador entre
        //find({precio: { $in: [10, 15, 25] }}) //consulta específica
        // .find()
        // .or([{ autor: 'Italo' }, { publicado: true }])
        // .and([{ autor: 'Italo' }, { publicado: true }])
        // .find({ nombre: /^V/ })//inicio
        //.find({ nombre: /js$/ })//final
        .find()//final
        .skip((numeroPagina - 1) * sizePage)//
        .limit(sizePage)
        .sort({ nombre: -1 })
        .select({ nombre: 1, etiquetas: 1 });
    console.log(cursos);
}
listarCurso();

// async function actualizarCurso(id) {
//     const curso = await Curso.findById(id)
//     if (!curso) {
//         console.log("El curso no existe")
//         return;
//     }
//     curso.publicado = false;
//     curso.autor = 'Italo Ramirez';

//     /* Segundo método */
//     //     curso.set({
//     //         publicado: false,
//     //         autor: 'Italo Ramirez'
//     //     })
//     const response = await curso.save();
//     console.log(response);
// }
// actualizarCurso('610f5f1c7331842c094fa14e');

/* Segundo método */
// async function actualizarCurso(id) {
//     const resultado = await Curso.update({ _id: id }, {
//         $set: {
//             autor: 'Italo',
//             publicado: true
//         },
//     });
//     console.log(resultado);
// }
// actualizarCurso('610f5f1c7331842c094fa14e');
/* Tercer método */
async function actualizarCurso(id) {
    const resultado = await Curso.findByIdAndUpdate(id, {
        $set: {
            autor: 'Gabriel Ramírez',
            publicado: false
        },
    }, { new: true });//para ver cuando se realiza el update
    console.log(resultado);
}
// actualizarCurso('610f7229fd245c325c881409');
/*  */
async function eleminarCurso(id) {
    const response = await Curso.deleteOne({
        // const response = await Curso.findByIdAndDelete(id)
        _id: id,
    });
    console.log(response);
}

eleminarCurso('610f72c6423e12329f8a8e66');


