class Jugador {

    private _num_intentos: number;
    private _puntuacion: number;
    private _pregunta: Pregunta;

    constructor () {
        this._num_intentos = 10;
        this._puntuacion = 100;
    }

    get num_intentos(): number {
        return this._num_intentos;
    }

    set num_intentos(num_intentos: number) {
        this._num_intentos = num_intentos;
    }

    get puntuacion(): number {
        return this._puntuacion;
    }

    set puntuacion(puntuacion: number) {
        this._puntuacion = puntuacion;
    }

    get pregunta(): Pregunta {
        return this._pregunta;
    }

    set pregunta(pregunta: Pregunta) {
        this._pregunta = pregunta;
    }

    public mostrar_datos_jugador(): void {
        div_num_intentos.innerHTML = this._num_intentos + "";
        div_puntuacion.innerHTML = this._puntuacion + "";
    }

    public mostrar_resultados_jugador(): void {
        div_resultados_intentos.innerHTML = this._num_intentos + "";
        div_resultados_puntuacion.innerHTML = this._puntuacion + "";
    }
    
}