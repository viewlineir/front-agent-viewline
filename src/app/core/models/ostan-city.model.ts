export interface IOstanModel {
    id: number;
    name: string;
    cities: ICitiesModel[]
}

export interface ICitiesModel {
    id: number;
    name: string;
    ostanId: number;
}