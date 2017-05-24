let pasapalabra = new Pasapalabra();

$(document).ready(function() {

    $( "a#boton_seleccion_dificultad" ).click(function(event) {
        event.preventDefault();

        if (pasapalabra.gameState == GameState.GAME_STARTING) {

            //Cambiamos el estado del juego para que el jugador no pueda volver a entrar aquí hasta que termine el proceso
            pasapalabra.gameState = GameState.PROCESSING;

            //Obtenemos la dificultad escogida por el jugador
            let dificultad_seleccionada: string = get_nombre_dificultad( +select_dificultad.value );

            if (dificultad_seleccionada != "") {
                let _dificultad: Dificultad = new Dificultad(dificultad_seleccionada);

                //Enviamos la petición al servidor para que empiece el juego y inicialice nuestros datos
                sendAjaxRequest("POST", "empezar_juego", JSON.stringify(_dificultad), function(response) {

                    //Convertimos el JSON recibido en un objeto
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

            /*Cambiaremos el estado del juego y cambiaremos el color de los botones para que el usuario sepa que debe esperar 
            a que se termine el proceso para poder seguir enviando más preguntas*/
            div_error_respuesta.style.display = "none";
            pasapalabra.gameState = GameState.PROCESSING;
            activar_botones_juego(false);

            //Si la respuesta no está vacía, procederemos a enviarla al servidor y comprobar el resultado
            if (input_respuesta_pregunta.value.length != 0) {

                //Obtenemos la letra de la pregunta y la respuesta escrita por el jugador
                let _respuesta: Respuesta = new Respuesta(pasapalabra.jugador.pregunta.letra, input_respuesta_pregunta.value);
                
                //Enviaremos la respuesta al servidor
                sendAjaxRequest("POST", "comprobar_pregunta", JSON.stringify(_respuesta), function(response) {
                    let data: any = JSON.parse(response);
                    
                    //Si la operación se ha realizado con éxito, continuaremos con el juego
                    if (data[RESPONSE._OK]._ok) {

                        actualizar_marcadores(data[RESPONSE._NUM_INTENTOS], data[RESPONSE._PUNTUACION]);
                        //Convertimos el objeto recibido en un objeto Acertar
                        let solucion: Acertar = Acertar.createFromObject(data[RESPONSE._ACERTAR]);

                        let clase_div: string;

                        if (solucion.acertar) {
                            clase_div = FONDO_VERDE;
                        }
                        else {
                            clase_div = FONDO_ROJO;
                        }

                        //Cambiamos la clase de la letra seleccionada dependiendo de si la pregunta ha sido acertada o no
                        document.getElementById(solucion.letra).className = clase_div;
                        //Dejamos el input vacío
                        input_respuesta_pregunta.value = "";
                        //Y obtenemos la siguiente pregunta del rosco
                        obtener_pregunta_rosco();
                    }
                    //Si ha habido algún tipo de error, recargaremos la página
                    else {
                        location.reload();
                    }
                });
            }
            //Avisaremos al jugador de que no puede enviar una respuesta vacía
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
            activar_botones_juego(false);

            sendAjaxRequest("GET", "saltar_pregunta", JSON.stringify(""), function(response) {
                let data: any = JSON.parse(response);

                //Si la operación se ha realizado con éxito, continuaremos con el juego
                if (data[RESPONSE._OK]._ok) {
                    
                    //Convertimos el objeto recibido en un objeto Acertar
                    let solucion: Acertar = Acertar.createFromObject(data[RESPONSE._ACERTAR]);

                    //Volvemos a poner en azul la letra de la pregunta que vamos a saltarnos
                    document.getElementById(solucion.letra).className = FONDO_AZUL;
                    //Dejamos el input vacío
                    input_respuesta_pregunta.value = "";
                    //Y obtenemos la siguiente pregunta del rosco
                    obtener_pregunta_rosco();

                }
                else {
                    location.reload();
                }
            });

        }
    });

}); // END $(document).ready();

//Actualiza los marcadores de puntuación y número de intentos
function actualizar_marcadores(num_intentos: number, puntuacion: number) {
    pasapalabra.jugador.num_intentos = num_intentos;
    pasapalabra.jugador.puntuacion = puntuacion;
    pasapalabra.jugador.mostrar_datos_jugador();
}

//Dado un código, obtiene su dificultad
function get_nombre_dificultad(dificultad_seleccionada: number): string {

    let nombre_dificultad: string = "";

    switch(dificultad_seleccionada) {
        case Codigo_dificultad.FACIL: nombre_dificultad = "Fácil"; break;
        case Codigo_dificultad.NORMAL: nombre_dificultad = "Normal"; break;
        case Codigo_dificultad.DIFICIL: nombre_dificultad = "Difícil"; break;
    }

    return nombre_dificultad;

}

//Método genérico que se utilizará para enviar todas las peticiones AJAX que se enviarán en el juego
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

//Activa o desactiva la parte interactuable con el jugador del formulario de preguntas
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

//Obtiene una pregunta del servidor, la guarda en la instancia del jugador y la muestra por pantalla
function obtener_pregunta_rosco(): void {
    
    if (pasapalabra.gameState == GameState.PROCESSING) {

        sendAjaxRequest("GET", "get_pregunta", JSON.stringify(""), function(response) {
            let data: any = JSON.parse(response);

            //Si no se ha producido ningún error...
            if (data[RESPONSE._OK]._ok) {

                //Y no se ha acabado el juego
                if (data[RESPONSE._GANAR]._ganar == null) {
                    
                    //Creamos un objeto Pregunta a partir de la pregunta recibida por el servidor
                    let pregunta: Pregunta = Pregunta.createFromObject(data[RESPONSE._PREGUNTA]);

                    //Mostramos la pregunta
                    pregunta.mostrar();

                    //Guardamos temporalmente la pregunta para luego saber qué pregunta vamos a contestar
                    pasapalabra.jugador.pregunta = pregunta;
                    
                    /*Activamos los botones del formulario y cambiamos el estado del juego para que el jugador pueda volver a enviar
                    más respuestas*/
                    activar_botones_juego(true);
                    pasapalabra.gameState = GameState.ANSWERING;

                }
                else {

                    if(data[RESPONSE._GANAR]._ganar) {
                        div_resultado.className = FONDO_VERDE;
                        div_resultado.innerHTML = VICTORIA;
                    }
                    else {
                        div_resultado.className = FONDO_ROJO;
                        div_resultado.innerHTML = DERROTA;
                    }

                    section_resultado_rosco.show();
                    pasapalabra.gameState = GameState.ANSWERING;
                    
                }

                
            }
            else {
                location.reload();
            }
        });

    }

}