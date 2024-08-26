import { Persona } from "../persona.model";
import { ResponseOne } from "../responseOne.model";

export interface PersonaDetailState{
    cargando: boolean;
    errorCarga: boolean;
    personaPorId: Persona | null; 
}