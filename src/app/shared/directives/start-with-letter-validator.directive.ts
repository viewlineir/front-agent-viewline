import { Directive } from '@angular/core';
import { Validator, AbstractControl, ValidationErrors, NG_VALIDATORS, ValidatorFn } from '@angular/forms';

export function StartWithLetterValidator(): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    if (c.value === null || c.value.length === 0) {
      return null;
    }
    // console.log("c.value[0].match(/^[a-z]+$/i):",c.value[0].match(/[a-z]/i))
    // if(c.value[0].match(/^[a-z]+$/i)){
    if(/^[a-z]+$/.test(c.value[0])){
      return null;
    }
      return { startWithLetterValidator: true };
  };
}

@Directive({
  selector: '[appUniqueUserIdValidator][formControlName],[appUniqueUserIdValidator][formControl],[appUniqueUserIdValidator][ngModel]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: StartWithLetterValidatorDirective,
      multi: true
    }
  ]
})
export class StartWithLetterValidatorDirective implements Validator {
  validate(element: AbstractControl): ValidationErrors | null {
    return StartWithLetterValidator()(element);
  }
}
