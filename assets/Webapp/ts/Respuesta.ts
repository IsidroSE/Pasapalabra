class Respuesta {

    private _letra: string;
    private _respuesta: string;

    constructor (letra: string, respuesta: string) {
        this._letra = letra;
        this._respuesta = respuesta;
    }

    get letra(): string {
        return this._letra;
    }

    set letra(letra: string) {
        this._letra = letra;
    }

    get respuesta(): string {
        return this._respuesta;
    }

    set respuesta(respuesta: string) {
        this._respuesta = respuesta;
    }

}