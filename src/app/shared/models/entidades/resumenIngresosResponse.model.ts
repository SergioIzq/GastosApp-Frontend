import { Ingreso } from "./ingreso.model";
import { Gasto } from "./gasto.model";

export class ResumenIngresosResponse {
    IngresosTotales!: number;
    Ingresos!: Ingreso[];
    IngresosTotalCount!: number;
}
