let pasapalabra = new Pasapalabra();

$(document).ready(function() {

    $( "a#boton_seleccion_dificultad" ).click(function(event) {

        event.preventDefault();

        if (pasapalabra.gameState == GameState.GAME_STARTING) {

            let _dificultad: Dificultad = new Dificultad("Normal");
            console.log(JSON.stringify(_dificultad));
            sendAjaxRequest("POST", "get_dificultad_seleccionada", JSON.stringify(_dificultad), function(response) {
                console.log(response);
            });

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

function sendAjaxRequest(_type: string, _url: string, _params: string, _callback: CallbackFunction) {

    var request = $.ajax({
        type: _type,
        url: BASE_URL + _url,
        data: _params
    });
    request.done(function(res) {
        _callback(res);
    });
    request.fail(function(jqXHR, textStatus) {
        console.error(jqXHR);
        _callback({ err: true, message: "Request failed: " + textStatus });
    });

    /** USING TS-SERIALIZER TO SERIALIZE AND DESERIALIZE JSON OBJECTS */

}