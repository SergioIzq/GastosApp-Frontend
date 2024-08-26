import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberFormatter]'
})
export class NumberFormatterDirective {

  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('blur', ['$event.target.value']) onBlur(value: string) {
    // Validar el valor usando la expresión regular
    const regex = /^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/;
    if (!regex.test(value)) {
      // Si el valor no es válido, no hacemos nada o podemos mostrar un mensaje de error
      return;
    }

    // Divide el valor en parte entera y decimal usando la coma como separador decimal
    let [integerPart, decimalPart] = value.split(',');

    // Elimina todos los caracteres que no sean dígitos de la parte entera
    integerPart = integerPart.replace(/[^0-9]/g, '');

    // Añade puntos como separadores de miles en la parte entera
    const integerPartWithDots = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Combina la parte entera con la parte decimal, si existe
    let formattedValue = decimalPart 
      ? `${integerPartWithDots},${decimalPart}` 
      : integerPartWithDots;

    // Actualiza el valor del input
    this.el.value = formattedValue;
  }

  // Asegura que el valor se ve correctamente formateado cuando el campo recibe el foco
  @HostListener('focus', ['$event.target.value']) onFocus(value: string) {
    this.el.value = value;
  }
}
