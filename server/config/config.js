// ================================
//             Puerto
// ================================

process.env.PORT = process.env.PORT || 3000;

// ================================
//             Entorno
// ================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ================================
//          expiracion
// ================================
//60 segundos
//60 minutos
//24 horas
//30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


// ================================
//          seed
// ================================


process.env.SEED = process.env.SEED || "este-es-el-seed-desarrollo";

//Para definir la variable de entorno
//heroku config:set {NombreVariable}= "{el valor}"



// ================================
//          Base de datos
// ================================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_IRI;

}
process.env.URLDB = urlDB;

// ================================
//       Google client ID
// ================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '449743998733-v04mj5ap1ttukk0uek1e85tc9oc70a9p.apps.googleusercontent.com';