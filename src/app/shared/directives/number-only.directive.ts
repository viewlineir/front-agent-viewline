import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[numberOnly]',
    standalone: true
})
export class NumberOnlyDirective {
    @Input() allowDecimal: boolean = false;
    @Input() decimalPlaces: number = 2;

    constructor(private el: ElementRef<HTMLInputElement>) {}

    @HostListener('input', ['$event']) onInputChange(event: Event) {
        const inputElement = this.el.nativeElement;
        let filteredInput: string = inputElement.value;

        // Handling based on whether decimals are allowed
        if (this.allowDecimal) {
            filteredInput = this.enforceDecimalPlaces(filteredInput);
        } else {
            // Only allow digits if decimal is not allowed
            filteredInput = filteredInput.replace(/[^0-9۰-۹]/g, '');
        }

        this.updateInput(filteredInput, inputElement, event);
    }

    private enforceDecimalPlaces(filteredInput: string): string {
        // Enforce only the allowed number of decimal places by adjusting the regex
        // const regex = new RegExp(`^\\d+(\\.\\d{0,${this.decimalPlaces}})?`, 'g');
        const regex = new RegExp(`^\\d*(\\.\\d{0,${this.decimalPlaces}})?`, 'g');
        const result = filteredInput.match(regex);

        // Retrieve the first match or return an empty string if none
        const validResult = result ? result[0] : '';

        // Additionally, prevent entering a decimal point if no digits have been entered
        if (filteredInput.startsWith('.')) {
            return '0.';
        }

        return validResult;
    }

    private updateInput(filteredInput: string, inputElement: HTMLInputElement, event: Event) {
        if (inputElement.value !== filteredInput) {
            inputElement.value = filteredInput;
            event.stopPropagation();
        }
    }
}