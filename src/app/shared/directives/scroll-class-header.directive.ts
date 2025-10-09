import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, HostListener, Inject, PLATFORM_ID } from '@angular/core';

@Directive({
  selector: '[ScrollClassHeader]',
  standalone: true,
})
export class ScrollClassHeaderDirective {

  constructor(
    private el: ElementRef,
    @Inject(DOCUMENT) private _document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
  ) { }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    const headerHeight = this.el.nativeElement.offsetHeight;
    if (isPlatformBrowser(this.platformId)) {
      if (window.scrollY > headerHeight) {
        this.el.nativeElement.classList.add('header-scrolled');
        this._document.body.classList.add('scrolled');
      } else {
        this.el.nativeElement.classList.remove('header-scrolled');
        this._document.body.classList.remove('scrolled');
      }
    }
  }

}
