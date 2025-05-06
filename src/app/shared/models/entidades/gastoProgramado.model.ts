import { Concepto } from "./concepto.model";
import { Cuenta } from "./cuenta.model";
import { FormaPago } from "./formaPago.model";
import { Persona } from "./persona.model";
import { Proveedor } from "./proveedor.model";

export class GastoProgramado {
    Id!: number;
    Descripcion!: string;
    Concepto!: Concepto;
    Persona!: Persona;
    Proveedor!: Proveedor;
    FormaPago!: FormaPago;
    Cuenta!: Cuenta;
    IdUsuario!: number;
    FechaEjecucion!: Date;
    Monto!: number;
    Activo!: boolean;
    Frecuencia!: string;
    HangFireJobId!: string
}