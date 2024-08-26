import { Cliente } from "../cliente.model";
import { ResponseOne } from "../responseOne.model";

export interface ClienteDetailState{
    cargando: boolean;
    errorCarga: boolean;
    clientePorId: Cliente | null; 
}