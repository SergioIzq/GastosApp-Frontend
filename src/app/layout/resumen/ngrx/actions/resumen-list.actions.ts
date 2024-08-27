import { createAction, props } from '@ngrx/store';
import { ResumenDatos } from 'src/app/shared/models/entidades/resumenDatos.model';
import { ResumenGastosResponse } from 'src/app/shared/models/entidades/ResumenGastosResumen.model';
import { ResumenIngresosResponse } from 'src/app/shared/models/entidades/resumenIngresosResponse.model';

// Acciones para ingresos
export const LoadIngresos = createAction(
    '[Resumen] Load Ingresos',
    props<{ page: number; size: number; fechaInicio: Date | null; fechaFin: Date | null; idUsuario: number }>()
);

export const LoadIngresosSuccess = createAction(
    '[Resumen] Load Ingresos Success',
    props<{ payload: ResumenIngresosResponse }>()
);

export const LoadIngresosFailure = createAction(
    '[Resumen] Load Ingresos Failure',
    props<{ errorMessage: string }>()
);

// Acciones para gastos
export const LoadGastos = createAction(
    '[Resumen] Load Gastos',
    props<{ page: number; size: number; fechaInicio: Date | null; fechaFin: Date | null; idUsuario: number; }>()
);

export const LoadGastosSuccess = createAction(
    '[Resumen] Load Gastos Success',
    props<{ payload: ResumenGastosResponse }>()
);

export const LoadGastosFailure = createAction(
    '[Resumen] Load Gastos Failure',
    props<{ errorMessage: string }>()
);

export const ExportExcel = createAction(
    '[Resumen] ExportExcel',
    props<{ datos: ResumenDatos, dirPath: string }>()
);

export const ExportExcelSuccess = createAction(
    '[Resumen] ExportExcelSuccess'
)

export const ExportExcelFailure = createAction(
    '[Resumen] ExportExcelFailure',
    props<{ errorMessage: string }>()
);