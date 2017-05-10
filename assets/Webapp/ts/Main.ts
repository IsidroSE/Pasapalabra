let pasapalabra = new Pasapalabra();

$(document).ready(function() {

    $( "a#boton_seleccion_dificultad" ).click(function(event) {

        event.preventDefault();

        if (pasapalabra.gameState == GameState.GAME_STARTING) {

            let dificultad_seleccionada: string = get_nombre_dificultad( +select_dificultad.value );

            if (dificultad_seleccionada != "") {

                let _dificultad: Dificultad = new Dificultad(dificultad_seleccionada);

                sendAjaxRequest("POST", "empezar_juego", JSON.stringify(_dificultad), function(response) {
                    let data: any = JSON.parse(response);
                    /*console.log(data);
                    console.log(data._ok);*/
                    /*En el caso de que esté todo correcto, prepararemos la interfaz para empezar el juego*/
                    if (data._ok) { console.log(contenedor_seleccion_dificultad);
                        cambiar_estado_juego(GameState.PROCESSING);
                    }
                    //Si ha habido algún error, volveremos a cargar la página
                    else {
                        location.reload();
                    }
                });

            }

        }

    });

    /*
    $.ajax( {
        type: "GET",
        url: BASE_URL + "getData",
        data: "",
        success: function(data) {
            console.log(data);
        },
        error: function(xhr, exception) {
            console.log(xhr);
        }
    });*/

});

function get_nombre_dificultad(dificultad_seleccionada: number) {

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

function cambiar_estado_juego(estado_juego) {

    switch(estado_juego) {

        case GameState.GAME_STARTING: 
            pasapalabra.gameState = GameState.GAME_STARTING;
            input_respuesta_pregunta.disabled = true;
            btn_saltar.className = BOTON_DESACTIVADO;
            btn_comprobar.className = BOTON_DESACTIVADO;
        break;

        case GameState.ANSWERING:
            pasapalabra.gameState = GameState.ANSWERING;
            input_respuesta_pregunta.disabled = false;
            btn_saltar.className = BOTON_ACTIVADO;
            btn_comprobar.className = BOTON_ACTIVADO;
        break;

        case GameState.PROCESSING:
            pasapalabra.gameState = GameState.PROCESSING;
            input_respuesta_pregunta.disabled = true;
            btn_saltar.className = BOTON_DESACTIVADO;
            btn_comprobar.className = BOTON_DESACTIVADO;
            contenedor_seleccion_dificultad.hide();
        break;

        case GameState.GAME_ENDED:
            pasapalabra.gameState = GameState.GAME_ENDED;
            input_respuesta_pregunta.disabled = true;
            btn_saltar.className = BOTON_DESACTIVADO;
            btn_comprobar.className = BOTON_DESACTIVADO;
        break;
    }
}