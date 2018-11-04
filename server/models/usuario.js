const mongoose = require('mongoose');

const uniqueValiator = require('mongoose-unique-validator'); //Paquete que permite validar un unico valor
let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'], //defino los roles validos
    message: '{VALUE} no es un rol valido' //mensaje de error
};

let usuarioSchema = new Schema({ //creo nuevo modelo
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'El contraseña es necesario']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos

    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    rut: {
        type: String,
        required: [true, 'El rut es requerido']
    },
    telefono: {
        type: String,
        required: [true, 'El telefono es requerido']
    }

});

usuarioSchema.methods.toJSON = function() { //Funcion para eliminar la respuesta de la contraseña
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

usuarioSchema.plugin(uniqueValiator, { //Se utiliza para que el objeto creado utilice unplugin
    message: '{PATH} debe de ser unico' //mensaje de error
})

module.exports = mongoose.model('Usuario', usuarioSchema); //exporto el modelo