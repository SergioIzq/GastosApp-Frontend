export interface ExportarExcelOpciones {
  nombreArchivo: string;
  origen: 'tabla' | 'bbdd';
  columnas: string[];
  tamano: number;
  pagina: number;
}
