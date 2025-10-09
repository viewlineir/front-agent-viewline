import { Directive } from '@angular/core';
import { Validator, AbstractControl, ValidationErrors, NG_VALIDATORS, ValidatorFn } from '@angular/forms';

export function EmailPatternValidator(): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    if (c.value === null || c.value.length === 0) {
      return null;
    }
    
    const emailRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      const valid = emailRegex.test(c.value);
      return valid ? null : { emailPatternValidator: true };
  };
}

@Directive({
  selector: '[appEmailValidator][formControlName],[appEmailValidator][formControl],[appEmailValidator][ngModel]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: EmailPatternValidatorDirective,
      multi: true
    }
  ]
})
export class EmailPatternValidatorDirective implements Validator {
  validate(element: AbstractControl): ValidationErrors | null {
    return EmailPatternValidator()(element);
  }
}
