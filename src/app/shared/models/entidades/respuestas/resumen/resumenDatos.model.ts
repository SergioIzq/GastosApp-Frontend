import { Gasto } from "../../gasto.model";
import { Ingreso } from "../../ingreso.model";

export class ResumenDatos {
    Gastos!: Gasto[];
    Ingresos!: Ingreso[];
    IngresosTotales!: number;
    GastosTotales!: number;
}