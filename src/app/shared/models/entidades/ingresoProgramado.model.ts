import { Cliente } from "./cliente.model";
import { Concepto } from "./concepto.model";
import { Cuenta } from "./cuenta.model";
import { FormaPago } from "./formaPago.model";
import { Persona } from "./persona.model";

export class IngresoProgramado {
    Id!: number;
    Descripcion!: string;
    Concepto!: Concepto;
    Persona!: Persona;
    Cliente!: Cliente;
    FormaPago!: FormaPago;
    Cuenta!: Cuenta;
    IdUsuario!: number;
    DiaEjecucion!: number;
    Monto!: number;
    AjustarAUltimoDia!: boolean;
    Activo!: boolean;
}