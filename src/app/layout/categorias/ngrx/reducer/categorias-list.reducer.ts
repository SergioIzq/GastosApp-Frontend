import { createReducer, on } from "@ngrx/store";
import * as CategoriasListActions from '../actions/categorias-list.actions'
import { EntidadListState } from "src/app/shared/models/entidades/estados/entidadListState.model";
import { Categoria } from "src/app/shared/models/entidades/categoria.model";

export const estadoInicial: EntidadListState<Categoria> = { loading: false, lista: { TotalRecords: 0, Items: [] }, errorCarga: false };
export const categoriasListFeatureKey = 'categoriasListState';

export const categoriasListReducer = createReducer(
    estadoInicial,
    on(CategoriasListActions.LoadingCategorias, (state) => {
        return {
            ...state,
            loading: true,
        }
    }),
    on(CategoriasListActions.LoadingCategoriasSuccess, (state, { listaCategorias }) => {
        return {
            ...state,
            loading: false,
            lista: listaCategorias
        };
    }),
    on(CategoriasListActions.LoadingCategoriasFailure, (state) => {
        return {
            ...state,
            loading: false,
            errorCarga: true
        };
    }),
    on(CategoriasListActions.DeleteCategoriaSuccess, (state) => {
        return {
            ...state,
            loading: false,
        };
    }),
    on(CategoriasListActions.DeleteCategoriaFailure, (state, action) => {
        return {
            ...state,
            loading: false,
            errorMessage: action.errorMessage
        };
    }),
)

export function reducer(state: EntidadListState<Categoria> = estadoInicial, action: any): EntidadListState<Categoria> {
    return categoriasListReducer(state, action);
}