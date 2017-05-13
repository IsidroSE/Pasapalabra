class Pregunta {

    private _letra: string;
    private _definicion: string;

    constructor (letra: string, definicion: string) {
        this._letra = letra;
        this._definicion = definicion;
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

    public static createFromObject(object: Object): Pregunta {
        return new Pregunta(object["_letra"], object["_definicion"]);
    }

    public mostrar(): void {
        p_posicion_letra.innerHTML = "Con la " + this._letra + ":" ;
        p_pregunta.innerHTML = this._definicion;
    }

}