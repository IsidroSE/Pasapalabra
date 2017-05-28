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

    public object_to_pregunta_completa(rosco: Object[]): void {
        let pregunta: Pregunta_completa;

        for (let solucion of rosco) {
            pregunta = Pregunta_completa.createFromObject(solucion);
            this.agregar_pregunta(pregunta);
        }

    }

    public mostrar_tabla_resultados() {
        
        let DOM_tabla: string = "";
        let color_letra: string;

        for (let pregunta of this._solucion_preguntas) {

            if (pregunta.acertada) color_letra = VERDE;
            else color_letra = ROJO;

            DOM_tabla += '<tr class="' + color_letra + '" >';

            DOM_tabla += "<td>" + pregunta.letra + "</td>";
            DOM_tabla += "<td>" + pregunta.definicion + "</td>";
            DOM_tabla += "<td>" + pregunta.solucion + "</td>";
            DOM_tabla += "<td>" + pregunta.respuesta_jugador + "</td>";

            DOM_tabla += "</tr>";

        }
        
        section_resultado_rosco.html(DOM_tabla);
    }

}