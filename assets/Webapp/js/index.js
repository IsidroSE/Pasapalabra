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
var btn_saltar = document.getElementById("boton_saltar");
var btn_comprobar = document.getElementById("boton_comprobar");
//Clases CSS de los Botones
var BOTON_ACTIVADO = "myButton_enabled";
var BOTON_DESACTIVADO = "myButton_disabled";
//CSS del rosco
var FONDO_AZUL = "fondo_azul";
var FONDO_ROJO = "fondo_rojo";
var FONDO_AMARILLO = "fondo_amarillo";
//Valores iniciales de la puntuación del jugador
var NUM_INTENTOS_INICIAL = 10;
var PUNTUACION_INCIAL = 100;
//const TIEMPO_INICIAL: number = 300000;
//Selección de dificultad
var select_dificultad = document.getElementById("select_dificultad");
var btn_comenzar = document.getElementById("boton_seleccion_dificultad");
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
    function Respuesta(acierto) {
        this._acierto = acierto;
    }
    Object.defineProperty(Respuesta.prototype, "acierto", {
        get: function () {
            return this._acierto;
        },
        set: function (acierto) {
            this._acierto = acierto;
        },
        enumerable: true,
        configurable: true
    });
    return Respuesta;
}());
var Pregunta = (function () {
    function Pregunta(letra, dificultad, definicion) {
        this._letra = letra;
        this._dificultad = dificultad;
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
    Object.defineProperty(Pregunta.prototype, "dificultad", {
        get: function () {
            return this._dificultad;
        },
        set: function (dificultad) {
            this._dificultad = dificultad;
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
    return Pregunta;
}());
var Jugador = (function () {
    function Jugador() {
        this._num_intentos = NUM_INTENTOS_INICIAL;
        this._puntuacion = PUNTUACION_INCIAL;
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
    return Pasapalabra;
}());
var pasapalabra = new Pasapalabra();
$(document).ready(function () {
    $("a#boton_seleccion_dificultad").click(function (event) {
        event.preventDefault();
        if (pasapalabra.gameState == GameState.GAME_STARTING) {
            var _dificultad = new Dificultad("Normal");
            console.log(JSON.stringify(_dificultad));
            sendAjaxRequest("POST", "get_dificultad_seleccionada", JSON.stringify(_dificultad), function (response) {
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
function sendAjaxRequest(_type, _url, _params, _callback) {
    var request = $.ajax({
        type: _type,
        url: BASE_URL + _url,
        data: _params
    });
    request.done(function (res) {
        _callback(res);
    });
    request.fail(function (jqXHR, textStatus) {
        console.error(jqXHR);
        _callback({ err: true, message: "Request failed: " + textStatus });
    });
    /** USING TS-SERIALIZER TO SERIALIZE AND DESERIALIZE JSON OBJECTS */
}
//# sourceMappingURL=index.js.map