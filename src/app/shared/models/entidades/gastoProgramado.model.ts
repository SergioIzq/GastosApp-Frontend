import { Gasto } from "./gasto.model"

export class GastoProgramado extends Gasto {
    FechaInicio!: Date;
    FechaFin!: Date;
    Frecuencia!: string;
    Activo!: boolean;
}