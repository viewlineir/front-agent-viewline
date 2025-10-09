import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, Input, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ResizeService } from 'src/app/core/services/resize.service';
import { ICarouselLengthModel } from './models/carousel-length.model';
import { SwiperDirective } from './directive/swipper.directive';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, SwiperDirective],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CarouselComponent implements AfterViewInit {
  // ViewChild
  @ViewChild('scrollContainer') scrollContainerRef: ElementRef;

  // Input
  @Input({ required: true }) lengthData: number;
  @Input() withoutArrow: boolean = false;
  @Input() arrowTitle: boolean = false;
  @Input() titleCarousel: string;
  @Input() lengthDataBySize: ICarouselLengthModel = {
    desktopWide: 3,
    desktop: 3,
    tablet: 2,
    mobile: 1,
  };

  // boolean
  showArrowRight: boolean;
  showArrowLeft: boolean;

  constructor(
    private resizeService: ResizeService,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
  }

  //==================================
  // #region LIFE CYCLE HOOK 
  //==================================
  ngAfterViewInit(): void {
    this.resizeHandelCarousel();
    if (this.showArrowLeft || this.showArrowRight) {
      const scrollableElement = this._document.querySelectorAll('.list-carousel-wrapper') as NodeListOf<HTMLElement>;
      scrollableElement.forEach(element => {
        element.addEventListener('wheel', (event: WheelEvent) => {
          event.preventDefault();

          // Check the direction of the scroll (left or right)
          const scrollDirection = event.deltaY < 0 ? 60 : -60;

          // Scroll the element horizontally
          element.scrollBy({
            left: scrollDirection,
          });
        });
      });
    }
    this.cdr.detectChanges();
  }
  //#endregion
  //==================================
  // #region PUBLIC
  //==================================
  onScroll() {
    const scrollLeft = Math.abs(this.scrollContainerRef.nativeElement.scrollLeft);
    const scrollBox = this.scrollContainerRef.nativeElement.scrollWidth - this.scrollContainerRef.nativeElement.clientWidth;
    if (scrollLeft < scrollBox) {
      this.showArrowLeft = true;
    } else {
      this.showArrowLeft = false;
    }
    if (scrollLeft > 0) {
      this.showArrowRight = true;
    } else {
      this.showArrowRight = false;
    }
  }

  scrollWidgetMinus(): void {
    this.scrollContainerRef.nativeElement.scrollTo({ left: (this.scrollContainerRef.nativeElement.scrollLeft - 60), behavior: 'smooth' });
  }

  scrollWidgetPlus(): void {
    this.scrollContainerRef.nativeElement.scrollTo({ left: (this.scrollContainerRef.nativeElement.scrollLeft + 60), behavior: 'smooth' });
  }
  //#endregion
  //==================================
  // #region PRIVATE
  //==================================
  private resizeHandelCarousel(): void {
    this.conditionSizeWindow();
    this.resizeService.onResize().subscribe(() => {
      this.conditionSizeWindow();
    });
  }

  private conditionSizeWindow(): void {
    if (isPlatformBrowser(this.platformId)) {
      let windowSize = window.innerWidth;
      if (windowSize > 1439) {
        this.conditionCountData(this.lengthDataBySize.desktopWide);
      } else if (windowSize > 1023 && windowSize < 1440) {
        this.conditionCountData(this.lengthDataBySize.desktop);
      } else if (windowSize > 767 && windowSize < 1024) {
        this.conditionCountData(this.lengthDataBySize.tablet);
      } else {
        this.conditionCountData(this.lengthDataBySize.mobile);
      }
    }
  }

  private conditionCountData(count: number): void {
    if (this.lengthData && this.lengthData <= count) {
      this.showArrowLeft = false;
      this.showArrowRight = false;
    } else {
      this.showArrowLeft = true;
    }
  }
  //#endregion
}
