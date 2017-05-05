class Jugador {

    private _num_intentos: number;
    private _puntuacion: number;

    constructor () {
        this._num_intentos = NUM_INTENTOS_INICIAL;
        this._puntuacion = PUNTUACION_INCIAL;
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

    public mostrar_datos_jugador(): void {
        div_num_intentos.innerHTML = this._num_intentos + "";
        div_puntuacion.innerHTML = this._puntuacion + "";
    }
    
}