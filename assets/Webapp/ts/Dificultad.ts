class Dificultad {

    private _dificultad_seleccionada: string;

    constructor (dificultad_seleccionada: string) {
        this._dificultad_seleccionada = dificultad_seleccionada;
    }

    get dificultad_seleccionada(): string {
        return this._dificultad_seleccionada;
    }

    set dificultad_seleccionada(dificultad_seleccionada: string) {
        this._dificultad_seleccionada = dificultad_seleccionada;
    }

}