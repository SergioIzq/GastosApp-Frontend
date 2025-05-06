import { Cuenta } from "../../cuenta.model";
import { Traspaso } from "../../traspaso.model";

export class TraspasoByIdRespuesta{
    public TraspasoById!: Traspaso;
    public ListaCuentas!: Cuenta[];
}