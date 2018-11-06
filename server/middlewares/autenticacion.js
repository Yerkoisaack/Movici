const jwt = require('jsonwebtoken');

// ================================
//         Verificar token
// ================================

let verificaToken = (req, res, next) => {

    let token = req.get('token'); //tomo el token del headers

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            console.log("caga");
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        console.log("pasa el midelware");
        next();
    });


};

// ================================
//         Verificar rol
// ================================

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();

    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

}


module.exports = {
    verificaToken,
    verificaAdminRole
};