import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { EmptyListComponent } from '@app/shared/components/empty-list/empty-list.component';
import { PaginationShareComponent } from '@app/shared/components/pagination-share/pagination-share.component';
import { DateToPersian } from '@app/shared/pipes';
import { HistoryTransactionsDatasourceService } from './services/history-transactions-datasource.service';
import { IFilterHistoryTransactionsListModel } from './models/filter-history-transactions-list.model';
import { HistoryTransactionsService } from './services/history-transactions.service';
import { IHistoryTransactionsListModel } from './models/history-transactions-list.model';
import { IDashboardApiDataModel } from '@app/views/pages/dashboard/models/dashboard-api-data.model';
import { FilterHistoryTransactionsComponent } from './components/filter-history-transactions/filter-history-transactions.component';

@Component({
  selector: 'app-history-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    PaginationShareComponent,
    EmptyListComponent,
    MatProgressBarModule,
    DateToPersian,
    FilterHistoryTransactionsComponent
  ],
  templateUrl: './history-transactions.component.html',
  styleUrl: './history-transactions.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class HistoryTransactionsComponent implements OnInit {

  // Input
  @Input() dataDashboard: IDashboardApiDataModel;


  // models
  displayedColumns: string[] = ['createDate', 'price'];

  dataSource: HistoryTransactionsDatasourceService = inject(HistoryTransactionsDatasourceService);
  filters: IFilterHistoryTransactionsListModel = {} as IFilterHistoryTransactionsListModel;
  tableData: IHistoryTransactionsListModel[] = [];

  // string



  // number
  pageSize: number = 10;
  pageNumber: number = 1;
  totalCount: number = 0;

  // boolean
  loadingTable: boolean = false;

  // types


  constructor(
    private historyTransactionsService: HistoryTransactionsService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.dataSourceInit();
    this.applyFilter();
  }
  //==================================
  // #region LIFE CYCLE HOOK 
  //==================================
  ngOnInit(): void {
  }

  //#endregion
  //==================================
  // #region PRIVATE 
  //==================================
  private dataSourceInit(): void {
    this.dataSource.load(
      this.pageNumber,
      this.pageSize,
      this.filters
    );
  }

  private applyFilter(): void {
    effect(() => {
      this.tableData = this.dataSource.dataSource$();
      this.loadingTable = this.dataSource.loading$();
      this.totalCount = this.dataSource.length$();
      if (!this.shallowEqual(this.filters, this.historyTransactionsService.filter$())) {
        this.filters = this.historyTransactionsService.filter$();
        this.dataSource.load(1, this.pageSize, this.filters);
      }
      this.cdRef.detectChanges();
    }, { allowSignalWrites: true })
  }

  private shallowEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  //#endregion
  //==================================
  // #region PUBLIC 
  //==================================
  pageNumberSelected(event: number): void {
    this.pageNumber = event;

    this.dataSourceInit();
  }
  //#endregion
}

