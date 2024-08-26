import { Cuenta } from "./cuenta.model";

export class Traspaso {
    Id!: number;
    CuentaOrigen!: Cuenta;
    CuentaDestino!: Cuenta;
    Importe!: number;
    Fecha!: Date;
    Descripcion?: string;
    SaldoCuentaOrigen!: number;
    SaldoCuentaDestino!: number;
    IdUsuario!: number;
}