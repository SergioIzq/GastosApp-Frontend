import { Ingreso } from "../ingreso.model";
import { Gasto } from "../gasto.model";

export class ResumenGastosResponse {
    GastosTotales!: number;
    Gastos!: Gasto[];
    GastosTotalCount!: number;
}
