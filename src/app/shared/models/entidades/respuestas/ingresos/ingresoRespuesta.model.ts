import { Categoria } from "../../categoria.model";
import { Cliente } from "../../cliente.model";
import { Concepto } from "../../concepto.model";
import { Cuenta } from "../../cuenta.model";
import { FormaPago } from "../../formaPago.model";
import { Persona } from "../../persona.model";

export class IngresoRespuesta{
    ListaCuentas!: Cuenta[];
    ListaClientes!: Cliente[];
    ListaConceptos!: Concepto[];
    ListaCategorias!: Categoria[];
    ListaPersonas!: Persona[];
    ListaFormasPago!: FormaPago[];
}