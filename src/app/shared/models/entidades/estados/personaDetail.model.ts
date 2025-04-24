import { Persona } from "../persona.model";
import { ResponseOne } from "../respuestas/responseOne.model";

export interface PersonaDetailState{
    loading: boolean;
    errorCarga: boolean;
    personaPorId: Persona | null; 
}