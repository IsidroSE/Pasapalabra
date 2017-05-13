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

    public static createFromJson(jsonString: string): Pregunta {
        let object: any = JSON.parse(jsonString);
        return new Pregunta(object._letra, object._definicion);
    }

}