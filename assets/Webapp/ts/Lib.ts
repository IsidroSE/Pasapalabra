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
let article_formulario_juego: JQuery = <JQuery>$("article#formulario_juego");
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
let section_guardar_record: JQuery = <JQuery>$("section#guardar_record_container");
let div_resultado: HTMLElement = document.getElementById("div_resultado");
let section_resultado_rosco: JQuery = <JQuery>$("section#resultado_rosco table tbody"); // <-- Aquí va la tabla
let btn_nueva_partida: HTMLElement = document.getElementById("boton_nueva_partida");

//DOM de la sección de resultados
let article_resultados: JQuery = <JQuery>$("article#resultados");
let div_resultados_intentos: HTMLElement = document.getElementById("div_resultados_intentos");
let div_resultados_puntuacion: HTMLElement = document.getElementById("div_resultados_puntuacion");
let div_resultados_tiempo: HTMLElement = document.getElementById("div_resultados_tiempo");
let input_nick_introducido: HTMLInputElement = <HTMLInputElement>document.getElementById("input_nick_introducido");
let btn_guardar_record: HTMLElement = document.getElementById("boton_guardar_record");
let btn_no_guardar_record: HTMLElement = document.getElementById("boton_no_guardar_record");

//CSS de la ventana de resultados
const VERDE: string = "verde";
const ROJO: string = "rojo";

//Mensajes que se mostrarán al finalizar el juego
const MENSAJE_FIN_JUEGO: any = {
    VICTORIA: "¡Has ganado!",
    DERROTA: "¡No te quedan intentos para seguir jugando!",
    NO_TIEMPO: "¡Te se ha acabado el tiempo!"
};

//TIEMPO INICIAL
const MINUTOS: number = 5;
const SEGUNDOS: number = 0;