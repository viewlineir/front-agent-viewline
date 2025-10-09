import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMousePress]',
  standalone: true
})
export class MousePressDirective {

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.elementRef.nativeElement, 'pressed');
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.renderer.removeClass(this.elementRef.nativeElement, 'pressed');
  }

  @HostListener('mousedown')
  onButtonMouseDown() {
    this.renderer.addClass(this.elementRef.nativeElement, 'pressed');
  }

}
