const express = require('express');
const Usuario = require('../models/usuario'); //Exporto los modelos de usuario creado en models/usuario
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');



app.get('/indexxx', verificaToken, (req, res) => {
    console.log("entra a la pagina");
    return res.json({
        ok: true,
        message: "entra"
    });


});

app.get('/usuario', verificaToken, (req, res) => {


    let desde = req.query.desde || 0; //recibo una variable desde la url: {{url}}/usuario?desde=1
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    //En el 2 parametro de find, se pueden enviar los atributos que queremos retornar
    Usuario.find({ estado: true }, 'nombre email role estado google img') //dentro de {} se pueden filtrar los datos, ejemplo {google:true}
        .skip(desde) //desde el numero siguiente de los registros
        .limit(limite) // llamada con 5 registros
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            })

        });

});



app.post('/usuario', (req, res) => {

    let body = req.body;
    let usuario = new Usuario();
    usuario.nombre = body.nombre;
    usuario.email = body.correo;
    usuario.rut = body.rut;
    usuario.telefono = body.telefono;
    usuario.password = bcrypt.hashSync(body.password, 10);

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });





});
app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']); //la funcion pick proveniente del underscore, selecciona los atributos que se pueden modificar

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBorrado) => { //new retorna el valor modificado, runValitors, es para correr las reglas del Schema
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado

        });

    });




});
app.delete('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {

    let id = req.params.id;


    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true, runValidators: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado

        });
    });

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'usuario no encontrado'
    //             }
    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });
    // });

});

module.exports = app;