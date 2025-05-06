import { Persona } from "../persona.model";
import { ResponseOne } from "../respuestas/respuestas-genericas/responseOne.model";

export interface PersonaDetailState{
    loading: boolean;
    errorCarga: boolean;
    personaPorId: Persona | null; 
}