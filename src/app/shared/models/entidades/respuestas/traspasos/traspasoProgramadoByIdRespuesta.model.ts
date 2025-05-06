import { Cuenta } from "../../cuenta.model";
import { IngresoProgramado } from "../../ingresoProgramado.model";

export class IngresoProgramadoByIdRespuesta{
    public IngresoProgramadoById!: IngresoProgramado;
    public ListaCuentas!: Cuenta[];
}