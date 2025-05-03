import { createReducer, on } from "@ngrx/store";
import * as CategoriaDetailActions from '../actions/categoria-detail.actions'
import { CategoriaDetailState } from '../../../../shared/models/entidades/estados/categoriaDetail.model';

export const estadoInicial: CategoriaDetailState = { loading: false, categoriaPorId: null, errorCarga: false };
export const categoriaDetailFeatureKey = 'categoriaDetailState';

const categoriaDetailReducer = createReducer(
    estadoInicial,
    on(CategoriaDetailActions.GetCategoria, (state) => ({
        ...state,
        loading: true,
        errorCarga: false,
        createSuccess: false
    })),
    on(CategoriaDetailActions.GetCategoriaSuccess, (state, { categoria }) => ({
        ...state,
        loading: false,
        categoriaPorId: categoria,
        errorCarga: false,
        createSuccess: false
    })),
    on(CategoriaDetailActions.GetCategoriaFail, (state) => ({
        ...state,
        loading: false,
        categoriaPorId: null,
        errorCarga: true,
        createSuccess: false
    })),
    on(CategoriaDetailActions.CreateCategoria, (state) => ({
        ...state,
        loading: true,
        createSuccess: false,
    })),
    on(CategoriaDetailActions.CreateCategoriaSuccess, (state, { categoria }) => ({
        ...state,
        loading: false,
        createSuccess: true,
        createdCategoria: categoria
    })),
    on(CategoriaDetailActions.CreateCategoriaFailure, (state) => ({
        ...state,
        loading: false,
        createSuccess: false
    })),
    on(CategoriaDetailActions.UpdateCategoria, (state) => ({
        ...state,
        loading: true,
        createSuccess: false,
    })),
    on(CategoriaDetailActions.UpdateCategoriaSuccess, (state) => ({
        ...state,
        loading: false,
        createSuccess: false
    })),
    on(CategoriaDetailActions.UpdateCategoriaFailure, (state, action) => ({
        ...state,
        loading: false,
        createSuccess: false
    }))

);

export function reducer(state: CategoriaDetailState = estadoInicial, action: any): CategoriaDetailState {
    return categoriaDetailReducer(state, action);
}
