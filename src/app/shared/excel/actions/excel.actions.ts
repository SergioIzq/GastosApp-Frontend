import { createAction, props } from '@ngrx/store';
import { ExportarExcelOpciones } from '../exportar-excel-opciones.interface';

export const exportarExcel = createAction('ExportarExcel', props<{ url: string, opciones: ExportarExcelOpciones }>());

export const exportarExcelSuccess = createAction('ExportarExcelSuccess', props<{ blob: Blob; nombreArchivo: string }>());

export const exportarExcelFail = createAction('ExportarExcelFail', props<{ error: any }>());
