class Timer {

    private _minutos: number;
    private _segundos: number;
    private _encendido: boolean;

    constructor() {
        this._minutos = MINUTOS;
        this._segundos = SEGUNDOS;
        this._encendido = false;
    }

    get minutos(): number {
        return this._minutos;
    }

    set minutos(minutos: number) {
        this._minutos = minutos;
    }

    get segundos(): number {
        return this._segundos;
    }

    set segundos(segundos: number) {
        this._segundos = segundos;
    }

    get encendido(): boolean {
        return this._encendido;
    }

    set encendido(encendido: boolean) {
        this._encendido = encendido;
    }

    public start_timer(): void {
        this._encendido = true;
        this.tick();
    }

    private tick(): void {

        if (this._encendido) {

            let continuar_juego: boolean = true;

            if (this._segundos - 1 < 0) {

                if (this._minutos - 1 >= 0) {
                    this._minutos--;
                    this._segundos = 59;
                }

            }
            else {
                this._segundos--;
            }


            if (this._minutos == 0 && this._segundos == 0) {
                continuar_juego = false;
            }

            this.actualizar_contador();

            if (continuar_juego && this._encendido) {
                setTimeout(() => {this.tick()}, 1000);
            }
            else {
                this.fin_tiempo();
            }
        }

    }

    public actualizar_contador(): void {

        let minutos: string = this._minutos < 10 ? "0" + this._minutos : "" + this._minutos;
        let segundos: string = this._segundos < 10 ? "0" + this._segundos : "" + this._segundos;

        div_tiempo_restante.innerHTML = minutos + ":" + segundos;
    }

    public actualizar_resultados_contador(_minutos: number, _segundos: number): void {

        this.actualizar_contador();

        let minutos: string = _minutos < 10 ? "0" + _minutos : "" + _minutos;
        let segundos: string = _segundos < 10 ? "0" + _segundos : "" + _segundos;

        div_resultados_tiempo.innerHTML = minutos + ":" + segundos;

    }

    private fin_tiempo(): void {
        
        sendAjaxRequest("GET", "finish_game", JSON.stringify(""), function(response) {

            let data: any = JSON.parse(response);

            //Si no se ha producido ningún error...
            if (data[RESPONSE._OK]._ok) {
                let fondo_titulo: string = FONDO_ROJO;
                let mensaje_fin_juego: string = MENSAJE_FIN_JUEGO.NO_TIEMPO;
                finalizar_juego(fondo_titulo, mensaje_fin_juego);
            }
            else {
                location.reload();
            }

        });

    }

}