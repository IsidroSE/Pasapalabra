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


    $( "a#boton_comprobar" ).click(function(event) {
        event.preventDefault();

        if (pasapalabra.gameState == GameState.ANSWERING) {

            div_error_respuesta.style.display = "none";
            pasapalabra.gameState = GameState.PROCESSING;
            activar_botones_juego(false);

            if (input_respuesta_pregunta.value.length != 0) {
                let _respuesta: Respuesta = new Respuesta(pasapalabra.jugador.pregunta.letra, input_respuesta_pregunta.value);
                
                sendAjaxRequest("POST", "comprobar_pregunta", JSON.stringify(_respuesta), function(response) {
                    let data: any = JSON.parse(response);
                    
                    if (data[RESPONSE._OK]._ok) {
                        actualizar_marcadores(data[RESPONSE._NUM_INTENTOS], data[RESPONSE._PUNTUACION]);
                        let clase_div: string;
                        let solucion: Acertar = Acertar.createFromObject(data[RESPONSE._ACERTAR]);
                        if (solucion.acertar) {
                            clase_div = FONDO_VERDE;
                        }
                        else {
                            clase_div = FONDO_ROJO;
                        }
                        document.getElementById(solucion.letra).className = clase_div;
                        input_respuesta_pregunta.value = "";
                        obtener_pregunta_rosco();
                    }
                });
            }
            else {
                div_error_respuesta.style.display = "block";
                div_error_respuesta.innerHTML = "La respuesta no puede estar vacía";
            }

        }
    
    });

    $( "a#boton_saltar" ).click(function(event) { 
        event.preventDefault();

        if (pasapalabra.gameState == GameState.ANSWERING) {

            div_error_respuesta.style.display = "none";
            pasapalabra.gameState = GameState.PROCESSING;

            pasapalabra.gameState = GameState.ANSWERING; //borrar esto luego

        }
    });

}); // END $(document).ready();


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


function activar_botones_juego(activar: boolean): void {

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
            if (data[RESPONSE._OK]._ok) {
                let pregunta: Pregunta = Pregunta.createFromObject(data[RESPONSE._PREGUNTA]);
                pregunta.mostrar();
                pasapalabra.jugador.pregunta = pregunta;
                activar_botones_juego(true);
                pasapalabra.gameState = GameState.ANSWERING;
            }
            else {
                location.reload();
            }
        });

    }

}