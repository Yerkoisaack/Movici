function registrar() {

    let nombre = document.getElementById('Nombre').value;
    let rut = document.getElementById('Rut').value;
    let telefono = document.getElementById('Telefono').value;
    let correo = document.getElementById('Email').value;
    let contrasena1 = document.getElementById('Contrasena1').value;
    let contrasena2 = document.getElementById('Contrasena2').value;
    let cajacontrasena = document.getElementById('myDiv');
    let cajacorreo = document.getElementById('divCorreo');
    let cajacreado = document.getElementById('divCreado');
    let cajarut = document.getElementById('divRut');
    let cajacampo = document.getElementById('divCampo');


    if (nombre === '' || rut === '' || telefono === '' || correo === '' || contrasena1 === '' || contrasena2 === '') {
        cajacampo.style.display = "block";
        return 1;
    }



    validaRut(rut);

    if (contrasena1 === contrasena2) {
        $.ajax({
                // En data puedes utilizar un objeto JSON, un array o un query string
                data: { "nombre": nombre, "rut": rut, "telefono": telefono, "correo": correo, "password": contrasena1 },
                //Cambiar a type: POST si necesario
                type: "POST",
                // Formato de datos que se espera en la respuesta
                dataType: "json",
                // URL a la que se enviará la solicitud Ajax
                url: "/usuario",
            })
            .done(function(data, textStatus, jqXHR) {
                cajacampo.style.display = "none";
                cajacorreo.style.display = "none";
                cajacontrasena.style.display = "none";
                cajarut.style.display = "none";
                cajacreado.style.display = "block";
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                cajacorreo.style.display = "block";



            });
    } else {
        cajacontrasena.style.display = "block";

    }









}


function validaRut(rut) {
    let cajarut = document.getElementById('divRut');
    var suma = 0;
    var arrRut = rut.split("-");
    var rutSolo = arrRut[0];
    var verif = arrRut[1];
    var continuar = true;
    for (i = 2; continuar; i++) {
        suma += (rutSolo % 10) * i;
        rutSolo = parseInt((rutSolo / 10));
        i = (i == 7) ? 1 : i;
        continuar = (rutSolo == 0) ? false : true;
    }
    resto = suma % 11;
    dv = 11 - resto;
    if (dv == 10) {
        if (verif.toUpperCase() == 'K') {
            cajarut.style.display = "none";
        }

    } else if (dv == 11 && verif == 0) {
        cajarut.style.display = "none";
    } else if (dv == verif) {
        cajarut.style.display = "none";
    } else {
        cajarut.style.display = "block";
    }

}