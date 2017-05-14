class Acertar {

    private _letra: string;
    private _acertar: boolean;

    constructor (letra: string, acertar: boolean) {
        this._letra = letra;
        this._acertar = acertar;
    }

    get letra(): string {
        return this._letra;
    }

    set letra(letra: string) {
        this._letra = letra;
    }

    get acertar(): boolean {
        return this._acertar;
    }

    set acertar(acertar: boolean) {
        this._acertar = acertar;
    }

    public static createFromObject(object: Object): Acertar {
        return new Acertar(object["_letra"], object["_acertar"]);
    }

}