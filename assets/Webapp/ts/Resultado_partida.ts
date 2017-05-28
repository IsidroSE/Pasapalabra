class Resultado_partida {
    
    private _solucion_preguntas: Pregunta_completa[];

    constructor () {
        this._solucion_preguntas = [];
    }

    get solucion_preguntas(): Pregunta_completa[] {
        return this._solucion_preguntas;
    }

    set letra(solucion_preguntas: Pregunta_completa[]) {
        this._solucion_preguntas = solucion_preguntas;
    }

    public agregar_pregunta(pregunta: Pregunta_completa): void {
        this._solucion_preguntas.push(pregunta);
    }

}