import { Categoria } from "./categoria.model";

export class Concepto {
    Id!: number;
    Nombre!: string;
    Categoria!: Categoria;
    IdUsuario!: number;
    FechaCreacion!: Date;
}