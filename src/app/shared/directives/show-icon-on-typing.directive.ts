import { AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[appShowIconOnTyping]',
  standalone: true
})
export class ShowIconOnTypingDirective implements AfterViewInit {
  @Input('appShowIconOnTyping') classElement: string;
  @Input() form: FormGroup; // Inject the form

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngAfterViewInit(): void {
    this.onInput();

    // Check if the input is readonly and hide the icon accordingly
    const inputElement = this.elementRef.nativeElement as HTMLInputElement;
    const isReadonly = inputElement.readOnly;

    if (isReadonly) {
      this.toggleIconVisibility(false);
    }
    if(this.form){
      this.form.valueChanges.subscribe(() => {
        this.onInput(); // Trigger onInput when form value changes
      });
    }
  }

  @HostListener('input')
  onInput(): void {
    const inputElement = this.elementRef.nativeElement as HTMLInputElement;
    const showIcon = inputElement.value.trim().length > 0;
    this.toggleIconVisibility(showIcon);
  }

  private toggleIconVisibility(showIcon: boolean): void {
    let nextSibling = this.renderer.nextSibling(this.elementRef.nativeElement);
    while (nextSibling) {
      if (nextSibling.classList.contains(this.classElement.split('.')[1])) {
        // Now you have the next sibling element with the class        
        const nextSiblingElement = nextSibling as HTMLElement;
        this.renderer.setStyle(nextSiblingElement, 'display', showIcon ? 'flex' : 'none');
        // Perform any operations you need on the next sibling element
        break;
      }
      nextSibling = nextSibling.nextElementSibling;
    }
  }

}
