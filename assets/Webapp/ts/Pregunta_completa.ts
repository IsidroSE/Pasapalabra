class Pregunta_completa {
    
    private _letra: string;
    private _definicion: string;
    private _solucion: string;
    private _acertada: boolean;

    constructor (letra: string, definicion: string, solucion: string, acertada: boolean) {
        this._letra = letra;
        this._definicion = definicion;
        this._solucion = solucion;
        this._acertada = acertada;
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

}