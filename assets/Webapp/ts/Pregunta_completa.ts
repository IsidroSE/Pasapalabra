class Pregunta_completa {
    
    private _letra: string;
    private _definicion: string;
    private _solucion: string;
    private _acertada: boolean;
    private _respuesta_jugador: string;

    constructor (letra: string, definicion: string, solucion: string, acertada: boolean, respuesta_jugador: string) {
        this._letra = letra;
        this._definicion = definicion;
        this._solucion = solucion;
        this._acertada = acertada;
        this._respuesta_jugador = respuesta_jugador;
    }

    get letra(): string {
        return this._letra;
    }

    set letra(letra: string) {
        this._letra = letra;
    }

    get definicion(): string {
        return this._definicion;
    }

    set definicion(definicion: string) {
        this._definicion = definicion;
    }

    get solucion(): string {
        return this._solucion;
    }

    set solucion(solucion: string) {
        this._solucion = solucion;
    }

    get acertada(): boolean {
        return this._acertada;
    }

    set acertada(acertada: boolean) {
        this._acertada = acertada;
    }

    get respuesta_jugador(): string {
        return this._respuesta_jugador;
    }

    set respuesta_jugador(respuesta_jugador: string) {
        this._respuesta_jugador = respuesta_jugador;
    }

    public static createFromObject(object: Object): Pregunta_completa {
        return new Pregunta_completa (
            object["_letra"], 
            object["_definicion"], 
            object["_solucion"], 
            object["_acertada"], 
            object["_respuesta_jugador"]
        );
    }

}