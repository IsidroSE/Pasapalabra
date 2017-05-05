class Respuesta {

    private _acierto: boolean;

    constructor (acierto: boolean) {
        this._acierto = acierto;
    }

    get acierto(): boolean {
        return this._acierto;
    }

    set acierto(acierto: boolean) {
        this._acierto = acierto;
    }

}