import { AbstractControl, ValidationErrors } from '@angular/forms';

export function minAmountValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value !== null && value !== undefined) {
    const parsedValue = parseFloat(value.replace(',', '.'));
    if (isNaN(parsedValue) || parsedValue < 0.01) {
      return { minAmount: true }; // Devuelve un objeto con la clave del error
    }
  }
  return null; // Si no hay error, devuelve null
}
