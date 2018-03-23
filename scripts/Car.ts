class Car {
    modelis: string;
    pagaminimoData: string;
    spalva: string;
    type: string;
    id: number;

    constructor(id: number, modelis: string, pagaminimoData: string, spalva: string, type: string) {
        this.modelis = modelis;
        this.pagaminimoData = pagaminimoData;
        this.spalva = spalva;
        this.type = type;
        this.id = id;
    }
}