import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pagination-share',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './pagination-share.component.html',
  styleUrls: ['./pagination-share.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaginationShareComponent implements OnChanges {
  // Output
  @Output() pageNumber = new EventEmitter<number>();
  // Input
  @Input() pageSize: number;
  @Input() totalCount: number;
  @Input() pageNumberInput: number;
  // array
  paginationList: number[] = [];
  // number
  totalPages: number;
  endPage: number;
  startPage = 1;
  middlePage: number[];
  currentPage = 1;
  rangePageInsideDown = 0; // for down number slice list paginationList
  rangePageInsideUp = 4; // for up number slice list paginationList
  // boolean
  hidePaginate = true;
  constructor() { }

  //==================================
  // #region LIFE CYCLE HOOK 
  //==================================

  ngOnChanges(changes: SimpleChanges): void {
    this.getPager();
    if (changes && changes['pageNumberInput']) {
      this.currentPage = +changes['pageNumberInput'].currentValue;
      this.handleConditionPage();
    }
  }
  //#endregion

  //==================================
  // #region PRIVATE 
  //==================================
  private getPager(): void {
    // calculate total pages
    this.totalPages = Math.ceil(this.totalCount / this.pageSize);
    this.currentPage = 1;
    this.rangePageInsideDown = 0;
    this.rangePageInsideUp = 4;
    if (this.totalCount <= this.pageSize || this.totalPages <= 1) {
      this.hidePaginate = false;
    } else {
      this.startPage = 1;
      this.endPage = this.totalPages;
      this.hidePaginate = true;
    }
    // show pagination number for Smaller equals 6
    if (this.totalPages <= 6) {
      this.rangePageInsideDown = 0;
      this.rangePageInsideUp = 4;
    }

    // create an array of pages to ng-repeat in the pager control
    this.paginationList = [];
    for (let i = this.startPage + 1; i < this.endPage; i++) {
      this.paginationList.push(i);
    }
  }

  private handleConditionPage(): void {
    if (this.totalPages <= 6) {
      this.rangePageInsideDown = 0;
      this.rangePageInsideUp = 4;
    } else if (this.currentPage === 1) {
      this.rangePageInsideDown = 0;
      this.rangePageInsideUp = 4;
    } else if (this.currentPage < 5) {
      this.rangePageInsideDown = 0;
      this.rangePageInsideUp = 4;
    } else if (this.currentPage === this.endPage - 1) {
      this.rangePageInsideDown = this.currentPage - 4;
      this.rangePageInsideUp = this.currentPage - 1;
    } else if (this.currentPage === this.endPage) {
      this.rangePageInsideDown = this.currentPage - 5;
      this.rangePageInsideUp = this.currentPage - 1;
    } else {
      this.rangePageInsideDown = this.currentPage - 3;
      this.rangePageInsideUp = this.currentPage;
    }
  }
  //#endregion
  //==================================
  // #region PUBLIC 
  //==================================
  selectPage(page: number): void {
    this.currentPage = page;
    this.pageNumber.emit(page);
    this.handleConditionPage();
  }
  //#endregion

}
