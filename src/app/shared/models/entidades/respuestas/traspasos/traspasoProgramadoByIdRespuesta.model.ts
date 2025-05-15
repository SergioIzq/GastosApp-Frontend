import { Cuenta } from "../../cuenta.model";
import { TraspasoProgramado } from "../../traspasoProgramado.model";

export class TraspasoProgramadoByIdRespuesta{
    public TraspasoProgramadoById!: TraspasoProgramado;
    public ListaCuentas!: Cuenta[];
}