import { Categoria } from "../categoria.model";
import { ResponseOne } from "../responseOne.model";

export interface CategoriaDetailState{
    cargando: boolean;
    errorCarga: boolean;
    categoriaPorId: Categoria | null; 
}