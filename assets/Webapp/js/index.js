//Estado del juego
var GameState;
(function (GameState) {
    //Al cargar la página, eligiendo la dificultad
    GameState[GameState["GAME_STARTING"] = 0] = "GAME_STARTING";
    //Cuando el jugador puede usar el formulario para contestar a las preguntas
    GameState[GameState["ANSWERING"] = 1] = "ANSWERING";
    //Al procesar datos o comunicarse con el servidor
    GameState[GameState["PROCESSING"] = 2] = "PROCESSING";
    //Fin del juego: cuando el jugador gana o pierde
    GameState[GameState["GAME_ENDED"] = 3] = "GAME_ENDED";
})(GameState || (GameState = {}));
//URL que se utilizará para las peticiones AJAX
var BASE_URL = window.location.origin + "/Pasapalabra/";
//Puntuación del jugador (lo que se mostrará en la parte superior de la pantalla)
var div_num_intentos = document.getElementById("div_num_intentos");
var div_puntuacion = document.getElementById("div_puntuacion");
var div_tiempo_restante = document.getElementById("div_tiempo_restante");
//DOM del formulario con las preguntas
var article_formulario_juego = $("article#formulario_juego");
var p_posicion_letra = document.getElementById("p_posicion_letra");
var p_pregunta = document.getElementById("p_pregunta");
var input_respuesta_pregunta = document.getElementById("input_respuesta_pregunta");
var div_error_respuesta = document.getElementById("error_respuesta");
var btn_saltar = document.getElementById("boton_saltar");
var btn_comprobar = document.getElementById("boton_comprobar");
//Clases CSS de los Botones
var BOTON_ACTIVADO = "myButton_enabled";
var BOTON_DESACTIVADO = "myButton_disabled";
//CSS del rosco
var FONDO_AZUL = "fondo_azul";
var FONDO_VERDE = "fondo_verde";
var FONDO_ROJO = "fondo_rojo";
var FONDO_AMARILLO = "fondo_amarillo";
//Selección de dificultad
var contenedor_seleccion_dificultad = $("section#elegir_dificultad");
var select_dificultad = document.getElementById("select_dificultad");
var btn_comenzar = document.getElementById("boton_seleccion_dificultad");
//Dificultades
var Codigo_dificultad;
(function (Codigo_dificultad) {
    Codigo_dificultad[Codigo_dificultad["FACIL"] = 11] = "FACIL";
    Codigo_dificultad[Codigo_dificultad["NORMAL"] = 12] = "NORMAL";
    Codigo_dificultad[Codigo_dificultad["DIFICIL"] = 13] = "DIFICIL";
})(Codigo_dificultad || (Codigo_dificultad = {}));
//Nombre de los parámetros que enviará el servidor como respuesta
var RESPONSE = {
    _OK: "_ok",
    _GAMESTATE: "_gameState",
    _JUGADOR: "_jugador",
    _NUM_INTENTOS: "_num_intentos",
    _PUNTUACION: "_puntuacion",
    _ROSCO: "_rosco",
    _PREGUNTA: "_pregunta",
    _ACERTAR: "_acertar",
    _GANAR: "_ganar",
    _PLAYING_TIME: "_playing_time",
    _TIEMPO_PARTIDA: "_tiempo_partida"
};
//DOM de la ventana de guardar record
var section_guardar_record = $("section#guardar_record_container");
var div_resultado = document.getElementById("div_resultado");
var section_resultado_rosco = $("section#resultado_rosco table tbody"); // <-- Aquí va la tabla
var btn_nueva_partida = document.getElementById("boton_nueva_partida");
//DOM de la sección de resultados
var article_resultados = $("article#resultados");
var div_resultados_intentos = document.getElementById("div_resultados_intentos");
var div_resultados_puntuacion = document.getElementById("div_resultados_puntuacion");
var div_resultados_tiempo = document.getElementById("div_resultados_tiempo");
var input_nick_introducido = document.getElementById("input_nick_introducido");
var btn_guardar_record = document.getElementById("boton_guardar_record");
var btn_no_guardar_record = document.getElementById("boton_no_guardar_record");
//CSS de la ventana de resultados
var VERDE = "verde";
var ROJO = "rojo";
//Mensajes que se mostrarán al finalizar el juego
var MENSAJE_FIN_JUEGO = {
    VICTORIA: "¡Has ganado!",
    DERROTA: "¡No te quedan intentos para seguir jugando!",
    NO_TIEMPO: "¡Te se ha acabado el tiempo!"
};
//TIEMPO INICIAL
var MINUTOS = 5;
var SEGUNDOS = 0;
//Records
var records_facil = $("table#records_facil");
var records_normal = $("table#records_normal");
var records_dificil = $("table#records_dificil");
var Dificultad = (function () {
    function Dificultad(dificultad_seleccionada) {
        this._dificultad_seleccionada = dificultad_seleccionada;
    }
    Object.defineProperty(Dificultad.prototype, "dificultad_seleccionada", {
        get: function () {
            return this._dificultad_seleccionada;
        },
        set: function (dificultad_seleccionada) {
            this._dificultad_seleccionada = dificultad_seleccionada;
        },
        enumerable: true,
        configurable: true
    });
    return Dificultad;
}());
var Respuesta = (function () {
    function Respuesta(letra, respuesta) {
        this._letra = letra;
        this._respuesta = respuesta;
    }
    Object.defineProperty(Respuesta.prototype, "letra", {
        get: function () {
            return this._letra;
        },
        set: function (letra) {
            this._letra = letra;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Respuesta.prototype, "respuesta", {
        get: function () {
            return this._respuesta;
        },
        set: function (respuesta) {
            this._respuesta = respuesta;
        },
        enumerable: true,
        configurable: true
    });
    return Respuesta;
}());
var Pregunta = (function () {
    function Pregunta(letra, definicion) {
        this._letra = letra;
        this._definicion = definicion;
    }
    Object.defineProperty(Pregunta.prototype, "letra", {
        get: function () {
            return this._letra;
        },
        set: function (letra) {
            this._letra = letra;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pregunta.prototype, "definicion", {
        get: function () {
            return this._definicion;
        },
        set: function (definicion) {
            this._definicion = definicion;
        },
        enumerable: true,
        configurable: true
    });
    Pregunta.createFromObject = function (object) {
        return new Pregunta(object["_letra"], object["_definicion"]);
    };
    Pregunta.prototype.mostrar = function () {
        p_posicion_letra.innerHTML = "Con la " + this._letra + ":";
        document.getElementById(this._letra).className = FONDO_AMARILLO;
        p_pregunta.innerHTML = this._definicion;
    };
    return Pregunta;
}());
var Acertar = (function () {
    function Acertar(letra, acertar) {
        this._letra = letra;
        this._acertar = acertar;
    }
    Object.defineProperty(Acertar.prototype, "letra", {
        get: function () {
            return this._letra;
        },
        set: function (letra) {
            this._letra = letra;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Acertar.prototype, "acertar", {
        get: function () {
            return this._acertar;
        },
        set: function (acertar) {
            this._acertar = acertar;
        },
        enumerable: true,
        configurable: true
    });
    Acertar.createFromObject = function (object) {
        return new Acertar(object["_letra"], object["_acertar"]);
    };
    return Acertar;
}());
var Pregunta_completa = (function () {
    function Pregunta_completa(letra, definicion, solucion, acertada, respuesta_jugador) {
        this._letra = letra;
        this._definicion = definicion;
        this._solucion = solucion;
        this._acertada = acertada;
        this._respuesta_jugador = respuesta_jugador;
    }
    Object.defineProperty(Pregunta_completa.prototype, "letra", {
        get: function () {
            return this._letra;
        },
        set: function (letra) {
            this._letra = letra;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pregunta_completa.prototype, "definicion", {
        get: function () {
            return this._definicion;
        },
        set: function (definicion) {
            this._definicion = definicion;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pregunta_completa.prototype, "solucion", {
        get: function () {
            return this._solucion;
        },
        set: function (solucion) {
            this._solucion = solucion;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pregunta_completa.prototype, "acertada", {
        get: function () {
            return this._acertada;
        },
        set: function (acertada) {
            this._acertada = acertada;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pregunta_completa.prototype, "respuesta_jugador", {
        get: function () {
            return this._respuesta_jugador;
        },
        set: function (respuesta_jugador) {
            this._respuesta_jugador = respuesta_jugador;
        },
        enumerable: true,
        configurable: true
    });
    Pregunta_completa.createFromObject = function (object) {
        return new Pregunta_completa(object["_letra"], object["_definicion"], object["_solucion"], object["_acertada"], object["_respuesta_jugador"]);
    };
    return Pregunta_completa;
}());
var Resultado_partida = (function () {
    function Resultado_partida() {
        this._solucion_preguntas = [];
    }
    Object.defineProperty(Resultado_partida.prototype, "solucion_preguntas", {
        get: function () {
            return this._solucion_preguntas;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resultado_partida.prototype, "letra", {
        set: function (solucion_preguntas) {
            this._solucion_preguntas = solucion_preguntas;
        },
        enumerable: true,
        configurable: true
    });
    Resultado_partida.prototype.agregar_pregunta = function (pregunta) {
        this._solucion_preguntas.push(pregunta);
    };
    Resultado_partida.prototype.object_to_pregunta_completa = function (rosco) {
        var pregunta;
        for (var _i = 0, rosco_1 = rosco; _i < rosco_1.length; _i++) {
            var solucion = rosco_1[_i];
            pregunta = Pregunta_completa.createFromObject(solucion);
            this.agregar_pregunta(pregunta);
        }
    };
    Resultado_partida.prototype.mostrar_tabla_resultados = function () {
        var DOM_tabla = "";
        var color_letra;
        for (var _i = 0, _a = this._solucion_preguntas; _i < _a.length; _i++) {
            var pregunta = _a[_i];
            if (pregunta.acertada)
                color_letra = VERDE;
            else if (pregunta.acertada == false)
                color_letra = ROJO;
            else
                color_letra = "";
            DOM_tabla += '<tr class="' + color_letra + '" >';
            DOM_tabla += "<td>" + pregunta.letra + "</td>";
            DOM_tabla += "<td>" + pregunta.definicion + "</td>";
            DOM_tabla += "<td>" + pregunta.solucion + "</td>";
            var respuesta_jugador = pregunta.respuesta_jugador != null ? pregunta.respuesta_jugador : "";
            DOM_tabla += "<td>" + respuesta_jugador + "</td>";
            DOM_tabla += "</tr>";
        }
        section_resultado_rosco.html(DOM_tabla);
    };
    return Resultado_partida;
}());
var Record_jugador = (function () {
    function Record_jugador(player_name) {
        this._player_name = player_name;
    }
    Object.defineProperty(Record_jugador.prototype, "dificultad_seleccionada", {
        get: function () {
            return this._player_name;
        },
        set: function (player_name) {
            this._player_name = player_name;
        },
        enumerable: true,
        configurable: true
    });
    return Record_jugador;
}());
var Timer = (function () {
    function Timer() {
        this._minutos = MINUTOS;
        this._segundos = SEGUNDOS;
        this._encendido = false;
    }
    Object.defineProperty(Timer.prototype, "minutos", {
        get: function () {
            return this._minutos;
        },
        set: function (minutos) {
            this._minutos = minutos;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "segundos", {
        get: function () {
            return this._segundos;
        },
        set: function (segundos) {
            this._segundos = segundos;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "encendido", {
        get: function () {
            return this._encendido;
        },
        set: function (encendido) {
            this._encendido = encendido;
        },
        enumerable: true,
        configurable: true
    });
    Timer.prototype.start_timer = function () {
        this._encendido = true;
        this.tick();
    };
    Timer.prototype.tick = function () {
        var _this = this;
        if (this._encendido) {
            var continuar_juego = true;
            if (this._segundos - 1 < 0) {
                if (this._minutos - 1 >= 0) {
                    this._minutos--;
                    this._segundos = 59;
                }
            }
            else {
                this._segundos--;
            }
            if (this._minutos == 0 && this._segundos == 0) {
                continuar_juego = false;
            }
            this.actualizar_contador();
            if (continuar_juego && this._encendido) {
                setTimeout(function () { _this.tick(); }, 1000);
            }
            else {
                this.fin_tiempo();
            }
        }
    };
    Timer.prototype.actualizar_contador = function () {
        var minutos = this._minutos < 10 ? "0" + this._minutos : "" + this._minutos;
        var segundos = this._segundos < 10 ? "0" + this._segundos : "" + this._segundos;
        div_tiempo_restante.innerHTML = minutos + ":" + segundos;
    };
    Timer.prototype.actualizar_resultados_contador = function (_minutos, _segundos) {
        this.actualizar_contador();
        var minutos = _minutos < 10 ? "0" + _minutos : "" + _minutos;
        var segundos = _segundos < 10 ? "0" + _segundos : "" + _segundos;
        div_resultados_tiempo.innerHTML = minutos + ":" + segundos;
    };
    Timer.prototype.fin_tiempo = function () {
        sendAjaxRequest("GET", "finish_game", JSON.stringify(""), function (response) {
            var data = JSON.parse(response);
            //Si no se ha producido ningún error...
            if (data[RESPONSE._OK]._ok) {
                var fondo_titulo = FONDO_ROJO;
                var mensaje_fin_juego = MENSAJE_FIN_JUEGO.NO_TIEMPO;
                finalizar_juego(fondo_titulo, mensaje_fin_juego);
            }
            else {
                location.reload();
            }
        });
    };
    return Timer;
}());
var Jugador = (function () {
    function Jugador() {
        this._num_intentos = 10;
        this._puntuacion = 100;
        this._timer = new Timer();
    }
    Object.defineProperty(Jugador.prototype, "num_intentos", {
        get: function () {
            return this._num_intentos;
        },
        set: function (num_intentos) {
            this._num_intentos = num_intentos;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jugador.prototype, "puntuacion", {
        get: function () {
            return this._puntuacion;
        },
        set: function (puntuacion) {
            this._puntuacion = puntuacion;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jugador.prototype, "pregunta", {
        get: function () {
            return this._pregunta;
        },
        set: function (pregunta) {
            this._pregunta = pregunta;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jugador.prototype, "timer", {
        get: function () {
            return this._timer;
        },
        set: function (timer) {
            this._timer = timer;
        },
        enumerable: true,
        configurable: true
    });
    Jugador.prototype.mostrar_datos_jugador = function () {
        div_num_intentos.innerHTML = this._num_intentos + "";
        div_puntuacion.innerHTML = this._puntuacion + "";
        this.timer.actualizar_contador();
    };
    Jugador.prototype.mostrar_resultados_jugador = function () {
        div_resultados_intentos.innerHTML = this._num_intentos + "";
        div_resultados_puntuacion.innerHTML = this._puntuacion + "";
    };
    return Jugador;
}());
var Pasapalabra = (function () {
    function Pasapalabra() {
        this.preparar_juego();
    }
    Pasapalabra.prototype.preparar_juego = function () {
        this._gameState = GameState.GAME_STARTING;
        this._jugador = new Jugador();
        this._jugador.mostrar_datos_jugador();
        btn_saltar.className = BOTON_DESACTIVADO;
        btn_comprobar.className = BOTON_DESACTIVADO;
        this._resultado_partida = new Resultado_partida();
        section_guardar_record.hide();
        article_formulario_juego.show();
        article_resultados.hide();
        contenedor_seleccion_dificultad.show();
        $("article#rosco div").removeClass();
        $("article#rosco div").addClass(FONDO_AZUL);
    };
    Object.defineProperty(Pasapalabra.prototype, "gameState", {
        get: function () {
            return this._gameState;
        },
        set: function (gameState) {
            this._gameState = gameState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pasapalabra.prototype, "jugador", {
        get: function () {
            return this._jugador;
        },
        set: function (jugador) {
            this._jugador = jugador;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pasapalabra.prototype, "resultado_partida", {
        get: function () {
            return this._resultado_partida;
        },
        set: function (resultado_partida) {
            this._resultado_partida = resultado_partida;
        },
        enumerable: true,
        configurable: true
    });
    return Pasapalabra;
}());
//Cargamos toda la información necesaria para empezar el juego
records_normal.show();
var pasapalabra = new Pasapalabra();
$(document).ready(function () {
    //Selecciona la dificultad de las preguntas del rosco
    $("a#boton_seleccion_dificultad").click(function (event) {
        event.preventDefault();
        if (pasapalabra.gameState == GameState.GAME_STARTING) {
            //Cambiamos el estado del juego para que el jugador no pueda volver a entrar aquí hasta que termine el proceso
            pasapalabra.gameState = GameState.PROCESSING;
            //Obtenemos la dificultad escogida por el jugador
            var dificultad_seleccionada = get_nombre_dificultad(+select_dificultad.value);
            if (dificultad_seleccionada != "") {
                var _dificultad = new Dificultad(dificultad_seleccionada);
                //Enviamos la petición al servidor para que empiece el juego y inicialice nuestros datos
                sendAjaxRequest("POST", "empezar_juego", JSON.stringify(_dificultad), function (response) {
                    //Convertimos el JSON recibido en un objeto
                    var data = JSON.parse(response);
                    /*En el caso de que esté todo correcto, prepararemos la interfaz para empezar el juego*/
                    if (data[RESPONSE._OK]._ok) {
                        contenedor_seleccion_dificultad.hide();
                        var obj = data[RESPONSE._JUGADOR];
                        actualizar_marcadores(obj[RESPONSE._NUM_INTENTOS], obj[RESPONSE._PUNTUACION]);
                        obtener_pregunta_rosco();
                        pasapalabra.jugador.timer.start_timer();
                    }
                    else {
                        location.reload();
                    }
                });
            }
        }
    });
    //Enviará la respuesta del jugador al servidor para comprobar si la pregunta ha sido acertado o no
    $("a#boton_comprobar").click(function (event) {
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
                var _respuesta = new Respuesta(pasapalabra.jugador.pregunta.letra, input_respuesta_pregunta.value);
                //Enviaremos la respuesta al servidor
                sendAjaxRequest("POST", "comprobar_pregunta", JSON.stringify(_respuesta), function (response) {
                    //Convertimos el JSON recibido a un vector
                    var data = JSON.parse(response);
                    //Si la operación se ha realizado con éxito, continuaremos con el juego
                    if (data[RESPONSE._OK]._ok) {
                        var obj = data[RESPONSE._JUGADOR];
                        actualizar_marcadores(obj[RESPONSE._NUM_INTENTOS], obj[RESPONSE._PUNTUACION]);
                        //Convertimos el objeto recibido en un objeto Acertar
                        var solucion = Acertar.createFromObject(data[RESPONSE._ACERTAR]);
                        var clase_div = void 0;
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
                            var fondo_titulo = FONDO_ROJO;
                            var mensaje_fin_juego = MENSAJE_FIN_JUEGO.DERROTA;
                            finalizar_juego(fondo_titulo, mensaje_fin_juego);
                        }
                    }
                    else {
                        location.reload();
                    }
                });
            }
            else {
                div_error_respuesta.style.display = "block";
                div_error_respuesta.innerHTML = "La respuesta no puede estar vacía";
                pasapalabra.gameState = GameState.ANSWERING;
                activar_botones_juego(true);
            }
        }
    });
    //Pasará a la siguiente pregunta del rosco sin contesar a la actual
    $("a#boton_saltar").click(function (event) {
        event.preventDefault();
        if (pasapalabra.gameState == GameState.ANSWERING) {
            div_error_respuesta.style.display = "none";
            pasapalabra.gameState = GameState.PROCESSING;
            activar_botones_juego(false);
            sendAjaxRequest("GET", "saltar_pregunta", JSON.stringify(""), function (response) {
                var data = JSON.parse(response);
                //Si la operación se ha realizado con éxito, continuaremos con el juego
                if (data[RESPONSE._OK]._ok) {
                    //Convertimos el objeto recibido en un objeto Acertar
                    var solucion = Acertar.createFromObject(data[RESPONSE._ACERTAR]);
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
    $("a#boton_nueva_partida").click(function (event) {
        event.preventDefault();
        if (pasapalabra.gameState == GameState.GAME_ENDED) {
            sendAjaxRequest("GET", "acabar_partida", JSON.stringify(""), function (response) {
                var data = JSON.parse(response);
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
    $("a#boton_no_guardar_record").click(function (event) {
        event.preventDefault();
        if (pasapalabra.gameState == GameState.GAME_ENDED) {
            section_guardar_record.hide();
        }
    });
    //Obtiene el nick escrito y guarda el record en la base de datos
    $("a#boton_guardar_record").click(function (event) {
        event.preventDefault();
        if (pasapalabra.gameState == GameState.GAME_ENDED) {
            var nick = input_nick_introducido.value;
            if (nick != "") {
                var record = new Record_jugador(nick);
                sendAjaxRequest("POST", "guardar_record", JSON.stringify(record), function (response) {
                    var data = JSON.parse(response);
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
    $('#select_dificultad_record').change(function () {
        $("section#records table").hide();
        switch ($(this).val()) {
            case "201":
                records_facil.show();
                break;
            case "202":
                records_normal.show();
                break;
            case "203":
                records_dificil.show();
                break;
        }
    });
}); // END $(document).ready();
//Actualiza los marcadores de puntuación y número de intentos de la parte superior de la pantalla
function actualizar_marcadores(num_intentos, puntuacion) {
    pasapalabra.jugador.num_intentos = num_intentos;
    pasapalabra.jugador.puntuacion = puntuacion;
    pasapalabra.jugador.mostrar_datos_jugador();
}
//Dado un código, obtiene su dificultad
function get_nombre_dificultad(dificultad_seleccionada) {
    var nombre_dificultad = "";
    switch (dificultad_seleccionada) {
        case Codigo_dificultad.FACIL:
            nombre_dificultad = "Fácil";
            break;
        case Codigo_dificultad.NORMAL:
            nombre_dificultad = "Normal";
            break;
        case Codigo_dificultad.DIFICIL:
            nombre_dificultad = "Difícil";
            break;
    }
    return nombre_dificultad;
}
//Método genérico que se utilizará para enviar todas las peticiones AJAX que se enviarán en el juego
function sendAjaxRequest(_type, _url, _params, _callback) {
    var request = $.ajax({
        type: _type,
        url: BASE_URL + _url,
        data: _params,
        contentType: 'json'
    });
    request.done(function (res) {
        _callback(res);
    });
    request.fail(function (jqXHR, textStatus) {
        console.error(jqXHR);
        console.log("Request failed: " + textStatus);
    });
}
//Activa o desactiva la parte interactuable con el jugador del formulario de preguntas
function activar_botones_juego(activar) {
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
function obtener_pregunta_rosco() {
    if (pasapalabra.gameState == GameState.PROCESSING) {
        sendAjaxRequest("GET", "get_pregunta", JSON.stringify(""), function (response) {
            var data = JSON.parse(response);
            //Si no se ha producido ningún error...
            if (data[RESPONSE._OK]._ok) {
                //Y no se ha acabado el juego ni se ha acabado el tiempo
                if (data[RESPONSE._GANAR]._ganar == null && data[RESPONSE._PLAYING_TIME]._playing_time) {
                    //Creamos un objeto Pregunta a partir de la pregunta recibida por el servidor
                    var pregunta = Pregunta.createFromObject(data[RESPONSE._PREGUNTA]);
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
                    var fondo_titulo = void 0;
                    var mensaje_fin_juego = void 0;
                    if (data[RESPONSE._GANAR]._ganar) {
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
function finalizar_juego(fondo_titulo, mensaje_fin_juego) {
    div_resultado.className = fondo_titulo;
    div_resultado.innerHTML = mensaje_fin_juego;
    pasapalabra.gameState = GameState.GAME_ENDED;
    pasapalabra.jugador.timer.encendido = false;
    mostrar_resultados();
}
//Envía al servidor una petición para obtener los resultados finales y los muestra en la sección de resultados
function mostrar_resultados() {
    sendAjaxRequest("GET", "obtener_resultados", JSON.stringify(""), function (response) {
        //Convertimos el JSON recibido en un vector
        var data = JSON.parse(response);
        //Extraemos el jugador (puntuacion y numero de intentos), los minutos y segundos
        var _jugador = data[RESPONSE._JUGADOR];
        var _minutos = data[RESPONSE._TIEMPO_PARTIDA]._minutos;
        var _segundos = data[RESPONSE._TIEMPO_PARTIDA]._segundos;
        //Actualizamos el timer de la ventana de guardar record con el tiempo recibido
        pasapalabra.jugador.timer.actualizar_resultados_contador(+_minutos, +_segundos);
        //Actualizamos la puntuación y número de intentos en la parte superior de la pantalla
        actualizar_resultados(_jugador[RESPONSE._NUM_INTENTOS], _jugador[RESPONSE._PUNTUACION]);
        //Mostramos y ocultamos las interfaces correspondientes
        section_guardar_record.show();
        article_formulario_juego.hide();
        article_resultados.show();
        //Obtenemos el rosco
        var rosco = data[RESPONSE._ROSCO];
        //Guardamos el rosco en memoria y lo mostramos
        pasapalabra.resultado_partida.object_to_pregunta_completa(rosco);
        pasapalabra.resultado_partida.mostrar_tabla_resultados();
    });
}
//Actualiza los marcadores de puntuación y número de intentos
function actualizar_resultados(num_intentos, puntuacion) {
    pasapalabra.jugador.num_intentos = num_intentos;
    pasapalabra.jugador.puntuacion = puntuacion;
    pasapalabra.jugador.mostrar_resultados_jugador();
}
//# sourceMappingURL=index.js.map