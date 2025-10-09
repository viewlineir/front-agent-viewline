import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ITabsMenuModel } from './models/tabs-menu.model';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ResizeService } from '../../../core/services';


@Component({
  selector: 'app-tab-menu-inner-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './tab-menu-inner-page.component.html',
  styleUrl: './tab-menu-inner-page.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class TabMenuInnerPageComponent {
  // ViewChild
  @ViewChild('scrollContainer') scrollContainerRef: ElementRef;

  // Input
  @Input({required: true}) tabsList: ITabsMenuModel[];

  // boolean
  showArrowRight: boolean;
  showArrowLeft: boolean;

  constructor(
    private resizeService: ResizeService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  //==================================
  // #region LIFE CYCLE HOOK 
  //==================================
  ngAfterViewInit(): void {
    this.resizeHandelCarousel();
    this.cdr.detectChanges();
  }
  //#endregion
  //==================================
  // #region PUBLIC
  //==================================
  onScroll() {
    const scrollLeft = Math.abs(this.scrollContainerRef.nativeElement.scrollLeft);
    const scrollBox = this.scrollContainerRef.nativeElement.scrollWidth - this.scrollContainerRef.nativeElement.clientWidth;
    if (scrollLeft + 1 < scrollBox) {
      this.showArrowLeft = true;
    } else {
      this.showArrowLeft = false;
    }
    if (scrollLeft > 1) {
      this.showArrowRight = true;
    } else {
      this.showArrowRight = false;
    }
  }

  scrollWidgetMinus(): void {
    this.scrollContainerRef.nativeElement.scrollTo({ left: (this.scrollContainerRef.nativeElement.scrollLeft - 100), behavior: 'smooth' });
  }

  scrollWidgetPlus(): void {
    this.scrollContainerRef.nativeElement.scrollTo({ left: (this.scrollContainerRef.nativeElement.scrollLeft + 100), behavior: 'smooth' });
  }
  //#endregion
  //==================================
  // #region PRIVATE
  //==================================
  private resizeHandelCarousel(): void {
    this.checkshowArrow();
    this.resizeService.onResize().subscribe(() => {
      this.checkshowArrow();
    });
  }

  private checkshowArrow(): void {
    let scrollContainerScrollWidth = this.scrollContainerRef.nativeElement.scrollWidth;
    let parentElementWidth = this.scrollContainerRef.nativeElement.parentElement.offsetWidth;
    if (scrollContainerScrollWidth <= parentElementWidth) {
      this.showArrowLeft = false;
      this.showArrowRight = false;
    } else {
      this.showArrowLeft = true;
    }
  }
  //#endregion
}
