//Cargamos toda la información necesaria para empezar el juego
records_normal.show();
let pasapalabra = new Pasapalabra();

$(document).ready(function() {

    //Selecciona la dificultad de las preguntas del rosco
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
                        let obj: Object = data[RESPONSE._JUGADOR];
                        actualizar_marcadores(obj[RESPONSE._NUM_INTENTOS], obj[RESPONSE._PUNTUACION]);
                        obtener_pregunta_rosco();
                        pasapalabra.jugador.timer.start_timer();
                    }
                    //Si ha habido algún error, volveremos a cargar la página
                    else {
                        location.reload();
                    }
                });
            }
        }
    });


    //Enviará la respuesta del jugador al servidor para comprobar si la pregunta ha sido acertado o no
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

                    //Convertimos el JSON recibido a un vector
                    let data: any = JSON.parse(response);
                    
                    //Si la operación se ha realizado con éxito, continuaremos con el juego
                    if (data[RESPONSE._OK]._ok) {
                        
                        let obj: Object = data[RESPONSE._JUGADOR];
                        actualizar_marcadores(obj[RESPONSE._NUM_INTENTOS], obj[RESPONSE._PUNTUACION]);
                        //Convertimos el objeto recibido en un objeto Acertar
                        let solucion: Acertar = Acertar.createFromObject(data[RESPONSE._ACERTAR]);

                        let clase_div: string;

                        //Dependiendo de si ha acertado o no la pregunta, pintaremos la letra de un color u otro
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

                        //Comprobaremos si el jugador se ha quedado sin intentos
                        if (data[RESPONSE._GANAR]._ganar == null) {
                            //Y obtenemos la siguiente pregunta del rosco
                            obtener_pregunta_rosco();

                        }
                        else {

                            //En el caso de que no le queden intentos, mostraremos el correspondiente mensaje
                            let fondo_titulo: string = FONDO_ROJO;
                            let mensaje_fin_juego: string = MENSAJE_FIN_JUEGO.DERROTA;
                            finalizar_juego(fondo_titulo, mensaje_fin_juego);

                        }

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
                pasapalabra.gameState = GameState.ANSWERING;
                activar_botones_juego(true);
            }

        }
    
    });


    //Pasará a la siguiente pregunta del rosco sin contesar a la actual
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


    //Empieza una nueva partida
    $( "a#boton_nueva_partida" ).click(function(event) {
        event.preventDefault();

        if (pasapalabra.gameState == GameState.GAME_ENDED) {

            sendAjaxRequest("GET", "acabar_partida", JSON.stringify(""), function(response) {
                let data: any = JSON.parse(response);

                if (data[RESPONSE._OK]._ok) {
                    pasapalabra = new Pasapalabra();
                }
                else {
                    location.reload();
                }

            });

        }

    });


    //Oculta la ventana que te permite guardar el record
    $( "a#boton_no_guardar_record" ).click(function(event) {
        event.preventDefault();

        if (pasapalabra.gameState == GameState.GAME_ENDED) {
            section_guardar_record.hide();
        }
        
    });


    //Obtiene el nick escrito y guarda el record en la base de datos
    $( "a#boton_guardar_record" ).click(function(event) {
        event.preventDefault();

        if (pasapalabra.gameState == GameState.GAME_ENDED) {

            let nick: string = input_nick_introducido.value;

            if (nick != "") {

                let record: Record_jugador = new Record_jugador(nick);
            
                sendAjaxRequest("POST", "guardar_record", JSON.stringify(record), function(response) {
                    let data: any = JSON.parse(response);
                    
                    if (data[RESPONSE._OK]._ok) {
                        section_guardar_record.hide();
                    }
                    else {
                        location.reload();
                    }

                });

            }

        }

    });

    // select_dificultad.value

    $('#select_dificultad_record').change(function() {
        
        $("section#records table").hide();

        switch($(this).val()) {
            case "201": records_facil.show(); break;
            case "202": records_normal.show(); break;
            case "203": records_dificil.show(); break;
        }

    });


}); // END $(document).ready();


//Actualiza los marcadores de puntuación y número de intentos de la parte superior de la pantalla
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

                //Y no se ha acabado el juego ni se ha acabado el tiempo
                if (data[RESPONSE._GANAR]._ganar == null && data[RESPONSE._PLAYING_TIME]._playing_time) {
                    
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
                //Si el juego se ha acabado, mostraremos el correspondiente mensaje
                else {

                    let fondo_titulo: string;
                    let mensaje_fin_juego: string;

                    if(data[RESPONSE._GANAR]._ganar) {
                        fondo_titulo = FONDO_VERDE;
                        mensaje_fin_juego = MENSAJE_FIN_JUEGO.VICTORIA;
                    }
                    else {
                        fondo_titulo = FONDO_ROJO;
                        mensaje_fin_juego = MENSAJE_FIN_JUEGO.DERROTA;
                    }
                    
                    //Y finalizaremos el juego mostrando la solucion del rosco
                    finalizar_juego(fondo_titulo, mensaje_fin_juego);
                    
                }

                
            }
            else {
                location.reload();
            }
        });

    }

}


//Dado un mensaje y una clase, muestra su correspondiente mensaje en la ventana de los resultados finales
function finalizar_juego(fondo_titulo: string, mensaje_fin_juego: string) {

    div_resultado.className = fondo_titulo;
    div_resultado.innerHTML = mensaje_fin_juego;
    pasapalabra.gameState = GameState.GAME_ENDED;
    pasapalabra.jugador.timer.encendido = false;
    mostrar_resultados();

}


//Envía al servidor una petición para obtener los resultados finales y los muestra en la sección de resultados
function mostrar_resultados(): void {

    sendAjaxRequest("GET", "obtener_resultados", JSON.stringify(""), function(response) {

        //Convertimos el JSON recibido en un vector
        let data: any = JSON.parse(response);

        //Extraemos el jugador (puntuacion y numero de intentos), los minutos y segundos
        let _jugador: Object = data[RESPONSE._JUGADOR];
        let _minutos: string = data[RESPONSE._TIEMPO_PARTIDA]._minutos;
        let _segundos: string = data[RESPONSE._TIEMPO_PARTIDA]._segundos;

        //Actualizamos el timer de la ventana de guardar record con el tiempo recibido
        pasapalabra.jugador.timer.actualizar_resultados_contador( +_minutos, +_segundos );

        //Actualizamos la puntuación y número de intentos en la parte superior de la pantalla
        actualizar_resultados(_jugador[RESPONSE._NUM_INTENTOS], _jugador[RESPONSE._PUNTUACION]);

        //Mostramos y ocultamos las interfaces correspondientes
        section_guardar_record.show();
        article_formulario_juego.hide();
        article_resultados.show();

        //Obtenemos el rosco
        let rosco: any = data[RESPONSE._ROSCO];

        //Guardamos el rosco en memoria y lo mostramos
        pasapalabra.resultado_partida.object_to_pregunta_completa(rosco);
        pasapalabra.resultado_partida.mostrar_tabla_resultados();

    });

}

//Actualiza los marcadores de puntuación y número de intentos
function actualizar_resultados(num_intentos: number, puntuacion: number) {
    pasapalabra.jugador.num_intentos = num_intentos;
    pasapalabra.jugador.puntuacion = puntuacion;
    pasapalabra.jugador.mostrar_resultados_jugador();
}