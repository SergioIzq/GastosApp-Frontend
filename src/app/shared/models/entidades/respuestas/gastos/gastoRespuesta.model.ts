import { Categoria } from "../../categoria.model";
import { Concepto } from "../../concepto.model";
import { Cuenta } from "../../cuenta.model";
import { FormaPago } from "../../formaPago.model";
import { Persona } from "../../persona.model";
import { Proveedor } from "../../proveedor.model";

export class GastoRespuesta{
    ListaCuentas!: Cuenta[];
    ListaProveedores!: Proveedor[];
    ListaConceptos!: Concepto[];
    ListaCategorias!: Categoria[];
    ListaPersonas!: Persona[];
    ListaFormasPago!: FormaPago[];
}