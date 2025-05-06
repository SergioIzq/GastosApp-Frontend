import { Cuenta } from "./cuenta.model";

export class TraspasoProgramado {
    Id!: number;
    CuentaOrigen!: Cuenta;
    CuentaDestino!: Cuenta;
    Importe!: number;
    Fecha!: Date;
    Descripcion?: string;
    SaldoCuentaOrigen!: number;
    SaldoCuentaDestino!: number;
    IdUsuario!: number;
    FechaCreacion!: Date;
    FechaEjecucion!: Date;
    Activo!: boolean;
    Frecuencia!: string;
    HangfireJobId!: string
}