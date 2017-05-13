class Pasapalabra {

    private _gameState: number;
    private _jugador: Jugador;

    constructor() {
        this.preparar_juego();
    }

    public preparar_juego(): void {
        this._gameState = GameState.GAME_STARTING;
        this._jugador = new Jugador();
        this._jugador.mostrar_datos_jugador();
        btn_saltar.className = BOTON_DESACTIVADO;
        btn_comprobar.className = BOTON_DESACTIVADO;
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
    
}