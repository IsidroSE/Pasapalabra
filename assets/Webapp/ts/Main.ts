let pasapalabra = new Pasapalabra();

$(document).ready(function() {

    $( "a#boton_seleccion_dificultad" ).click(function(event) {
        event.preventDefault();

        if (pasapalabra.gameState == GameState.GAME_STARTING) {

            pasapalabra.gameState = GameState.PROCESSING;

            let dificultad_seleccionada: string = get_nombre_dificultad( +select_dificultad.value );

            if (dificultad_seleccionada != "") {
                let _dificultad: Dificultad = new Dificultad(dificultad_seleccionada);

                sendAjaxRequest("POST", "empezar_juego", JSON.stringify(_dificultad), function(response) {
                    let data: any = JSON.parse(response);

                    /*En el caso de que esté todo correcto, prepararemos la interfaz para empezar el juego*/
                    if (data[RESPONSE._OK]._ok) {
                        contenedor_seleccion_dificultad.hide();
                        actualizar_marcadores(data[RESPONSE._NUM_INTENTOS], data[RESPONSE._PUNTUACION]);
                        obtener_pregunta_rosco();
                    }
                    //Si ha habido algún error, volveremos a cargar la página
                    else {
                        location.reload();
                    }
                });

            }

        }

    });

});


function actualizar_marcadores(num_intentos: number, puntuacion: number) {
    pasapalabra.jugador.num_intentos = num_intentos;
    pasapalabra.jugador.puntuacion = puntuacion;
    pasapalabra.jugador.mostrar_datos_jugador();
}


function get_nombre_dificultad(dificultad_seleccionada: number): string {

    let nombre_dificultad: string = "";

    switch(dificultad_seleccionada) {
        case Codigo_dificultad.FACIL: nombre_dificultad = "Fácil"; break;
        case Codigo_dificultad.NORMAL: nombre_dificultad = "Normal"; break;
        case Codigo_dificultad.DIFICIL: nombre_dificultad = "Difícil"; break;
    }

    return nombre_dificultad;

}


function sendAjaxRequest(_type: string, _url: string, _params: string, _callback: CallbackFunction) {

    var request = $.ajax({
        type: _type,
        url: BASE_URL + _url,
        data: _params,
        contentType: 'json'
    });
    request.done(function(res) {
        _callback(res);
    });
    request.fail(function(jqXHR, textStatus) {
        console.error(jqXHR);
        console.log("Request failed: " + textStatus);
    });

}


function gestionar_botones_juego(activar: boolean): void {

    input_respuesta_pregunta.disabled = !activar;

    if (activar) {
        btn_saltar.className = BOTON_ACTIVADO;
        btn_comprobar.className = BOTON_ACTIVADO;
    }
    else {
        btn_saltar.className = BOTON_DESACTIVADO;
        btn_comprobar.className = BOTON_DESACTIVADO;
    }
}


function obtener_pregunta_rosco(): void {
    
    if (pasapalabra.gameState == GameState.PROCESSING) {

        sendAjaxRequest("GET", "get_pregunta", JSON.stringify(""), function(response) {
            let data: any = JSON.parse(response);
            let pregunta: Pregunta = Pregunta.createFromJson(response);
            mostrar_pregunta(pregunta);
            pasapalabra.gameState = GameState.ANSWERING;
            gestionar_botones_juego(true);
        });

    }

}


function mostrar_pregunta(pregunta: Pregunta): void {
    p_posicion_letra.innerHTML = "Con la " + pregunta.letra + ":" ;
    p_pregunta.innerHTML = pregunta.definicion;
}