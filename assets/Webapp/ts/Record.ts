class Record_jugador {

    private _player_name: string;

    constructor (player_name: string) {
        this._player_name = player_name;
    }

    get dificultad_seleccionada(): string {
        return this._player_name;
    }

    set dificultad_seleccionada(player_name: string) {
        this._player_name = player_name;
    }

}