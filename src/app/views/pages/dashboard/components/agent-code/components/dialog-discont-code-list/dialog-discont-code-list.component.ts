import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, Input, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { EmptyListComponent } from '@app/shared/components/empty-list/empty-list.component';
import { PaginationShareComponent } from '@app/shared/components/pagination-share/pagination-share.component';
import { DateToPersian } from '@app/shared/pipes';
import { IFilterDiscountCodeListModel } from '../../models/filter-discount-code-list.model';
import { AgentCodeListDatasourceService } from '../../services/agent-code-list-datasource.service';
import { IListDiscountRecordsModel } from '@app/views/pages/dashboard/models/list-discount.model';
import { AgentCodeService } from '../../services/agent-code.service';

@Component({
  selector: 'app-dialog-discont-code-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    PaginationShareComponent,
    EmptyListComponent,
    MatProgressBarModule,
    DateToPersian,
  ],
  templateUrl: './dialog-discont-code-list.component.html',
  styleUrl: './dialog-discont-code-list.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DialogDiscontCodeListComponent {

  // Input
  @Input() totalRegisterWithCode: number;

  // models
  displayedColumns: string[] = ['row', 'code', 'createdOnUtc', 'discountMultiPercentAgent', 'discountMultiPercentStudent', 'registerCount', 'incomeFromPaidAmount'];

  dataSource: AgentCodeListDatasourceService = inject(AgentCodeListDatasourceService);
  filters: IFilterDiscountCodeListModel = {} as IFilterDiscountCodeListModel;
  tableData: IListDiscountRecordsModel[] = [];

  // number
  pageSize: number = 10;
  pageNumber: number = 1;
  totalCount: number = 0;

  // boolean
  loadingTable: boolean = false;


  constructor(
    public dialogRef: MatDialogRef<DialogDiscontCodeListComponent>,
    private agentCodeService: AgentCodeService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.dataSourceInit();
    this.applyFilter();
  }

  //==================================
  // #region LIFE CYCLE HOOK 
  //==================================


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
      if (!this.shallowEqual(this.filters, this.agentCodeService.filter$())) {
        this.filters = this.agentCodeService.filter$();
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
  close(): void {
    this.dialogRef.close();
  }

  pageNumberSelected(event: number): void {
    this.pageNumber = event;

    this.dataSourceInit();
  }


  //#endregion
}
