import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormatter'
})
export class NumberFormatterPipe implements PipeTransform {

  transform(value: number | string, ...args: any[]): string {
    if (value == null) return '';

    // Asegúrate de que el valor sea un número
    let numberValue = typeof value === 'string' ? parseFloat(value) : value;

    // Verifica que el valor sea un número válido
    if (isNaN(numberValue)) return '';

    // Divide el número en parte entera y decimal
    const [integerPart, decimalPart] = numberValue.toFixed(2).split('.');

    // Añade puntos como separadores de miles
    const integerPartWithDots = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Devuelve el valor formateado con coma como separador decimal
    return `${integerPartWithDots},${decimalPart}`;
  }
}
