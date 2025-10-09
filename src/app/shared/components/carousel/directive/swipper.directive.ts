import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  ElementRef,
  Output,
  EventEmitter,
  Renderer2
} from '@angular/core';
import { fromEvent, merge, Subscription } from 'rxjs';
import { switchMap, map, takeUntil, tap } from 'rxjs/operators';

export type SwiperType = 'horizontal' | 'vertical' | 'both';
@Directive({
  selector: '[swiper-scroll]',
  standalone: true
})
export class SwiperDirective implements OnInit, OnDestroy {
  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  subscription: Subscription;
  avoidScroll: Subscription;

  @Input('swiper-scroll') direction: SwiperType = 'horizontal';

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.avoidScroll = fromEvent(this.elementRef.nativeElement, 'touchmove').subscribe((e: any) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  }

  ngOnInit() {
    this.subscription = merge(
      fromEvent(this.elementRef.nativeElement, 'mousedown'),
      fromEvent(this.elementRef.nativeElement, 'touchstart').pipe(
        map((event: any) => event.changedTouches ? event.changedTouches[0] : event)
      )
    ).pipe(
      tap(() => this.disableTextSelection()),
      switchMap((startEvent: any) => {
        return merge(
          fromEvent(this.elementRef.nativeElement, 'mousemove'),
          fromEvent(this.elementRef.nativeElement, 'touchmove').pipe(
            map((event: any) => event.changedTouches ? event.changedTouches[0] : event)
          )
        ).pipe(
          takeUntil(merge(
            fromEvent(document, 'mouseup'),
            fromEvent(document, 'touchend')
          ).pipe(
            tap(() => this.enableTextSelection()),
            tap((event: any) => {
              if (Math.abs(event.pageX - startEvent.pageX) < 10) {
                const item = ([...this.elementRef.nativeElement.children] || []).find(x => x.contains(event.target)) || null;
                if (item) this.select.emit(item);
              }
            })
          )),
          map((moveEvent: any) => ({ startEvent, moveEvent }))
        );
      })
    ).subscribe(({ startEvent, moveEvent }) => {
      const incX = moveEvent.pageX - startEvent.pageX;
      const incY = moveEvent.pageY - startEvent.pageY;
      this.elementRef.nativeElement.scrollBy({
        left: this.direction !== 'vertical' ? -incX : 0,
        top: this.direction !== 'horizontal' ? -incY : 0,
        behavior: 'smooth'
      });
    });
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
    this.avoidScroll && this.avoidScroll.unsubscribe();
  }

  disableTextSelection() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'user-select', 'none');
  }

  enableTextSelection() {
    this.renderer.removeStyle(this.elementRef.nativeElement, 'user-select');
  }
}
