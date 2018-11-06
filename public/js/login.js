function iniciar() {


    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    $.ajax({
            // En data puedes utilizar un objeto JSON, un array o un query string
            data: { "email": email, "password": password },
            //Cambiar a type: POST si necesario
            type: "POST",
            // Formato de datos que se espera en la respuesta
            dataType: "json",
            // URL a la que se enviará la solicitud Ajax
            url: "/login",
        })
        .done(function(data, textStatus, jqXHR) {
            alert('correcto');
            console.log(data.usuario);
            console.log(data.token);


            console.log("envio desde js");
            $.ajax({
                url: "/indexxx",
                type: 'GET',
                data: { "email": data.usuario.email, "nombre": data.usuario.nombre, "telefono": data.usuario.telefono },
                // Fetch the stored token from localStorage and set in the header
                headers: { "token": data.token }
            }).done(function(data, textStatus, jqXHR) {
                location.href = "/index.html"
            }).fail(function(jqXHR, textStatus, errorThrown) {
                alert('Incorrecto');
            });
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            alert('Incorrecto');
        });


}