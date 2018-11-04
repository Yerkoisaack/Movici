const express = require('express');
const Usuario = require('../models/usuario');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);




app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usurioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usurioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "(Usuario) o contraseña incorrectos"
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usurioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o (contraseña) incorrectos"
                }
            });
        }

        let token = jwt.sign({ //creando token
                usuario: usurioDB //definiendo paidload
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }) //primero semilla y la expiracion esta en segundos*minutos*horas*dias

        res.json({
            ok: true,
            usuario: usurioDB,
            token
        });

    });


});

//CONFIGURACIONES DE GOOGLE


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}



app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });


    Usuario.findOne({ email: googleUser.email }, (err, usurioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (usurioDB) {
            if (usurioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Debe utilizar autenticacion normal"
                    }
                });
            } else {
                let token = jwt.sign({ //creando token
                        usuario: usurioDB //definiendo paidload
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }) //primero semilla y la expiracion esta en segundos*minutos*horas*dias
                return res.json({
                    ok: true,
                    usuario: usurioDB,
                    token
                });
            }
        } else {
            //si el usuario no existe en la base de datos
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usurioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };
                let token = jwt.sign({ //creando token
                        usuario: usurioDB //definiendo paidload
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }) //primero semilla y la expiracion esta en segundos*minutos*horas*dias
                return res.json({
                    ok: true,
                    usuario: usurioDB,
                    token
                });
            });

        }

    });


});








module.exports = app;