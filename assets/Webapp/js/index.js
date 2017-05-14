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
    _NUM_INTENTOS: "_num_intentos",
    _PUNTUACION: "_puntuacion",
    _PREGUNTA: "_pregunta",
    _ACERTAR: "_acertar"
};
//const TIEMPO_INICIAL: number = 300000; 
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
var Jugador = (function () {
    function Jugador() {
        this._num_intentos = 10;
        this._puntuacion = 100;
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
    Jugador.prototype.mostrar_datos_jugador = function () {
        div_num_intentos.innerHTML = this._num_intentos + "";
        div_puntuacion.innerHTML = this._puntuacion + "";
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
    return Pasapalabra;
}());
var pasapalabra = new Pasapalabra();
$(document).ready(function () {
    $("a#boton_seleccion_dificultad").click(function (event) {
        event.preventDefault();
        if (pasapalabra.gameState == GameState.GAME_STARTING) {
            pasapalabra.gameState = GameState.PROCESSING;
            var dificultad_seleccionada = get_nombre_dificultad(+select_dificultad.value);
            if (dificultad_seleccionada != "") {
                var _dificultad = new Dificultad(dificultad_seleccionada);
                sendAjaxRequest("POST", "empezar_juego", JSON.stringify(_dificultad), function (response) {
                    var data = JSON.parse(response);
                    /*En el caso de que esté todo correcto, prepararemos la interfaz para empezar el juego*/
                    if (data[RESPONSE._OK]._ok) {
                        contenedor_seleccion_dificultad.hide();
                        actualizar_marcadores(data[RESPONSE._NUM_INTENTOS], data[RESPONSE._PUNTUACION]);
                        obtener_pregunta_rosco();
                    }
                    else {
                        location.reload();
                    }
                });
            }
        }
    });
    $("a#boton_comprobar").click(function (event) {
        event.preventDefault();
        if (pasapalabra.gameState == GameState.ANSWERING) {
            div_error_respuesta.style.display = "none";
            pasapalabra.gameState = GameState.PROCESSING;
            activar_botones_juego(false);
            if (input_respuesta_pregunta.value.length != 0) {
                var _respuesta = new Respuesta(pasapalabra.jugador.pregunta.letra, input_respuesta_pregunta.value);
                sendAjaxRequest("POST", "comprobar_pregunta", JSON.stringify(_respuesta), function (response) {
                    var data = JSON.parse(response);
                    if (data[RESPONSE._OK]._ok) {
                        actualizar_marcadores(data[RESPONSE._NUM_INTENTOS], data[RESPONSE._PUNTUACION]);
                        var clase_div = void 0;
                        var solucion = Acertar.createFromObject(data[RESPONSE._ACERTAR]);
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
    $("a#boton_saltar").click(function (event) {
        event.preventDefault();
        if (pasapalabra.gameState == GameState.ANSWERING) {
            div_error_respuesta.style.display = "none";
            pasapalabra.gameState = GameState.PROCESSING;
            pasapalabra.gameState = GameState.ANSWERING; //borrar esto luego
        }
    });
}); // END $(document).ready();
function actualizar_marcadores(num_intentos, puntuacion) {
    pasapalabra.jugador.num_intentos = num_intentos;
    pasapalabra.jugador.puntuacion = puntuacion;
    pasapalabra.jugador.mostrar_datos_jugador();
}
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
function obtener_pregunta_rosco() {
    if (pasapalabra.gameState == GameState.PROCESSING) {
        sendAjaxRequest("GET", "get_pregunta", JSON.stringify(""), function (response) {
            var data = JSON.parse(response);
            if (data[RESPONSE._OK]._ok) {
                var pregunta = Pregunta.createFromObject(data[RESPONSE._PREGUNTA]);
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
//# sourceMappingURL=index.js.map