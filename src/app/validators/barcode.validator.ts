import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function barcodeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value.match(/^(\d{8}|\d{12,14})$/)) {
      return { barcode: true };
    }

    const paddedValue = value.padStart(14, '0');

    let result = 0;
    for (let i = 0; i < paddedValue.length - 1; i += 1) {
      result += parseInt(paddedValue.charAt(i), 10) * (i % 2 === 0 ? 3 : 1);
    }

    return (10 - (result % 10)) % 10 === parseInt(paddedValue.charAt(13), 10)
      ? null
      : { barcode: true };
  };
}
