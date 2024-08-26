import { Cliente } from './cliente.model';
import { Concepto } from './concepto.model';
import { Cuenta } from './cuenta.model';
import { FormaPago } from './formaPago.model';
import { Persona } from './persona.model';
import { Proveedor } from './proveedor.model';

export class Gasto {
    Id!: number;
    Concepto!: Concepto;
    Persona!: Persona;
    Proveedor!: Proveedor;
    FormaPago!: FormaPago;
    Cuenta!: Cuenta;
    Monto!: number | null;
    Fecha!: Date;
    Descripcion!:string;
    IdUsuario!: number;
}