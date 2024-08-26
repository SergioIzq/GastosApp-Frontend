import { createReducer, on } from "@ngrx/store";
import * as CategoriaDetailActions from '../actions/categoria-detail.actions'
import { CategoriaDetailState } from '../../../../shared/models/entidades/estados/categoriaDetail.model';

export const estadoInicial: CategoriaDetailState = { cargando: false, categoriaPorId: null, errorCarga: false };

const categoriaDetailReducer = createReducer(
    estadoInicial,
    on(CategoriaDetailActions.GetCategoria, (state) => ({
        ...state,
        cargando: true,
        errorCarga: false,
        createSuccess: false
    })),
    on(CategoriaDetailActions.GetCategoriaSuccess, (state, { categoria }) => ({
        ...state,
        cargando: false,
        categoriaPorId: categoria,
        errorCarga: false,
        createSuccess: false
    })),
    on(CategoriaDetailActions.GetCategoriaFail, (state) => ({
        ...state,
        cargando: false,
        categoriaPorId: null,
        errorCarga: true,
        createSuccess: false
    })),
    on(CategoriaDetailActions.CreateCategoria, (state) => ({
        ...state,
        cargando: true,
        createSuccess: false,
    })),
    on(CategoriaDetailActions.CreateCategoriaSuccess, (state, { categoria }) => ({
        ...state,
        cargando: false,
        createSuccess: true,
        createdCategoria: categoria
    })),
    on(CategoriaDetailActions.CreateCategoriaFailure, (state) => ({
        ...state,
        cargando: false,
        createSuccess: false
    })),
    on(CategoriaDetailActions.UpdateCategoria, (state) => ({
        ...state,
        cargando: true,
        createSuccess: false,
    })),
    on(CategoriaDetailActions.UpdateCategoriaSuccess, (state) => ({
        ...state,
        cargando: false,
        createSuccess: false
    })),
    on(CategoriaDetailActions.UpdateCategoriaFailure, (state, action) => ({
        ...state,
        cargando: false,
        createSuccess: false
    }))

);

export function CategoriaDetailReducer(state: CategoriaDetailState = estadoInicial, action: any): CategoriaDetailState {
    return categoriaDetailReducer(state, action);
}
