import { Ingreso } from "../../ingreso.model";

export class ResumenIngresosResponse {
    IngresosTotales!: number;
    Ingresos!: Ingreso[];
    IngresosTotalCount!: number;
}
