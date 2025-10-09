import { Directive, ElementRef, EventEmitter, HostListener, Input, Optional, Output } from '@angular/core';
import { FormGroup, FormGroupDirective, NgControl } from '@angular/forms';

@Directive({
  selector: '[appClearFormsField]',
  standalone: true
})
export class ClearFormFieldsDirective {

  @Output() sendRequestForEmptyElement = new EventEmitter<boolean>();
  
  private formGroup: FormGroup | null;

  constructor(
    private el: ElementRef,
    @Optional() private ngControl: NgControl,
    @Optional() private formGroupDirective: FormGroupDirective
  ) { }

  @HostListener('click')
  onClick() {
    if (this.ngControl) {
      this.formGroup = this.ngControl.control?.parent as FormGroup;
    } else if (this.formGroupDirective) {
      this.formGroup = this.formGroupDirective.form;
    }
    const formControlName = this.el.nativeElement.getAttribute('data-formControlName');
    if (this.formGroup && formControlName) {
      const control = this.formGroup.get(formControlName);
      if (control) {
        control.reset();
        this.sendRequestForEmptyElement.emit(true);
      }
    }
  }
}
