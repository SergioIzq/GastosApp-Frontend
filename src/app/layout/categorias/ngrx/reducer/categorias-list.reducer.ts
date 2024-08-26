import { createReducer, on } from "@ngrx/store";
import * as CategoriasListActions from '../actions/categorias-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Categoria } from "src/app/shared/models/entidades/categoria.model";

export const estadoInicial: EntidadListState<Categoria> = { cargando: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };

export const categoriasListReducer = createReducer(
    estadoInicial,
    on(CategoriasListActions.LoadingCategorias, (state) => {
        return {
            ...state,
            cargando: true,
        }
    }),
    on(CategoriasListActions.LoadingCategoriasSuccess, (state, { listaCategorias }) => {
        return {
            ...state,
            cargando: false,
            lista: listaCategorias
        };
    }),
    on(CategoriasListActions.LoadingCategoriasFailure, (state) => {
        return {
            ...state,
            cargando: false,
            errorCarga: true
        };
    }),
    on(CategoriasListActions.DeleteCategoriaSuccess, (state) => {
        return {
            ...state,
            cargando: false,
        };
    }),
    on(CategoriasListActions.DeleteCategoriaFailure, (state, action) => {
        return {
            ...state,
            cargando: false,
            errorMessage: action.errorMessage
        };
    }),
)