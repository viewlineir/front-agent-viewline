import { Directive } from '@angular/core';
import { Validator, AbstractControl, ValidationErrors, NG_VALIDATORS, ValidatorFn } from '@angular/forms';

export function timeFormatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        // Example pattern, adjust as needed
        const isValid = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
        return isValid ? null : { invalidTimeFormat: true };
    };
}

@Directive({
    selector: '[appTimeValidator][formControlName],[appTimeValidator][formControl],[appTimeValidator][ngModel]',
    standalone: true,
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: TimeFormatValidatorDirective,
            multi: true
        }
    ]
})
export class TimeFormatValidatorDirective implements Validator {
    validate(element: AbstractControl): ValidationErrors | null {
        return timeFormatValidator()(element);
    }
}
