class Pregunta {

    private _letra: string;
    private _dificultad: string;
    private _definicion: string;

    constructor (letra: string, dificultad: string, definicion: string) {
        this._letra = letra;
        this._dificultad = dificultad;
        this._definicion = definicion;
    }

    get letra(): string {
        return this._letra;
    }

    set letra(letra: string) {
        this._letra = letra;
    }

    get dificultad(): string {
        return this._dificultad;
    }

    set dificultad(dificultad: string) {
        this._dificultad = dificultad;
    }

    get definicion(): string {
        return this._definicion;
    }

    set definicion(definicion: string) {
        this._definicion = definicion;
    }

}