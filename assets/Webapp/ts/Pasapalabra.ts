class Pasapalabra {

    private _gameState: number;
    private _jugador: Jugador;
    private _resultado_partida: Resultado_partida;

    constructor() {
        this.preparar_juego();
    }

    public preparar_juego(): void {
        this._gameState = GameState.GAME_STARTING;
        this._jugador = new Jugador();
        this._jugador.mostrar_datos_jugador();
        btn_saltar.className = BOTON_DESACTIVADO;
        btn_comprobar.className = BOTON_DESACTIVADO;
        this._resultado_partida = new Resultado_partida();
        section_guardar_record.hide();
        article_formulario_juego.show();
        article_resultados.hide();
        contenedor_seleccion_dificultad.show();
        $("article#rosco div").removeClass();
        $("article#rosco div").addClass(FONDO_AZUL);
    }

    get gameState(): number {
        return this._gameState;
    }

    set gameState(gameState: number) {
        this._gameState = gameState;
    }

    get jugador(): Jugador {
        return this._jugador;
    }

    set jugador(jugador: Jugador) {
        this._jugador = jugador;
    }

    get resultado_partida(): Resultado_partida {
        return this._resultado_partida;
    }

    set resultado_partida(resultado_partida: Resultado_partida) {
        this._resultado_partida = resultado_partida;
    }
    
}