import { Categoria } from "../categoria.model";

export interface CategoriaDetailState{
    loading: boolean;
    errorCarga: boolean;
    categoriaPorId: Categoria | null; 
}