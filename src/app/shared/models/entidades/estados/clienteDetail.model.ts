import { Cliente } from "../cliente.model";

export interface ClienteDetailState{
    loading: boolean;
    errorCarga: boolean;
    clientePorId: Cliente | null; 
}