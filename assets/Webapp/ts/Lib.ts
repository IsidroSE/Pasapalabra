//Estado del juego
enum GameState {
    //Al cargar la página, eligiendo la dificultad
    GAME_STARTING,
    //Cuando el jugador puede usar el formulario para contestar a las preguntas
    ANSWERING,
    //Al procesar datos o comunicarse con el servidor
    PROCESSING,
    //Fin del juego: cuando el jugador gana o pierde
    GAME_ENDED
}

//URL que se utilizará para las peticiones AJAX
const BASE_URL: string = window.location.origin + "/Pasapalabra/";

//Declaración del tipo callback
type CallbackFunction = (arg: any, ...args: any[]) => void;

//Puntuación del jugador (lo que se mostrará en la parte superior de la pantalla)
let div_num_intentos: HTMLElement = document.getElementById("div_num_intentos");
let div_puntuacion: HTMLElement = document.getElementById("div_puntuacion");
let div_tiempo_restante: HTMLElement = document.getElementById("div_tiempo_restante");

//DOM del formulario con las preguntas
let p_posicion_letra: HTMLElement = document.getElementById("p_posicion_letra");
let p_pregunta: HTMLElement = document.getElementById("p_pregunta");
let input_respuesta_pregunta: HTMLInputElement = <HTMLInputElement>document.getElementById("input_respuesta_pregunta");
let div_error_respuesta: HTMLElement = document.getElementById("error_respuesta");
let btn_saltar: HTMLElement = document.getElementById("boton_saltar");
let btn_comprobar: HTMLElement = document.getElementById("boton_comprobar");

//Clases CSS de los Botones
const BOTON_ACTIVADO: string = "myButton_enabled";
const BOTON_DESACTIVADO: string = "myButton_disabled";

//CSS del rosco
const FONDO_AZUL: string = "fondo_azul";
const FONDO_VERDE: string = "fondo_verde";
const FONDO_ROJO: string = "fondo_rojo";
const FONDO_AMARILLO: string = "fondo_amarillo";

//Selección de dificultad
let contenedor_seleccion_dificultad: JQuery = <JQuery>$("section#elegir_dificultad");
let select_dificultad: HTMLSelectElement = <HTMLSelectElement>document.getElementById("select_dificultad");
let btn_comenzar: HTMLElement = document.getElementById("boton_seleccion_dificultad");

//Dificultades
enum Codigo_dificultad {
    FACIL = 11,
    NORMAL = 12,
    DIFICIL = 13
}

//Nombre de los parámetros que enviará el servidor como respuesta
const RESPONSE: any = {
    _OK: "_ok",
    _GAMESTATE: "_gameState",
    _NUM_INTENTOS: "_num_intentos",
    _PUNTUACION: "_puntuacion",
    _PREGUNTA: "_pregunta",
    _ACERTAR: "_acertar",
    _GANAR: "_ganar"
};

//const TIEMPO_INICIAL: number = 300000;