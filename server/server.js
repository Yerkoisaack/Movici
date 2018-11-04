require('./config/config');

const express = require('express');
const mongoose = require('mongoose'); //importo moongoose para mongodb
const path = require('path'); //para publicar la carpeta public

const app = express();
const bodyParser = require('body-parser'); // Permite decodificar informacion enviada por x-www-form...
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());


//habilitar carpeta public

app.use(express.static(path.resolve(__dirname, '../public'))); //expongo la carpeta a publica, path.resolve, une los argumentos



//Importo todas las rutas
app.use(require('./routes/index'));





mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos online!');


});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`);
});