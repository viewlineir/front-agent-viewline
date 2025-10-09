import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { EmptyListComponent } from '@app/shared/components/empty-list/empty-list.component';
import { PaginationShareComponent } from '@app/shared/components/pagination-share/pagination-share.component';
import { DateToPersian, ElipsisPipe } from '@app/shared/pipes';
import { IFilterStudentModel } from '../../models/filter-student.model';
import { studentDatasourceService } from '../../services/student-datasource.service';
import { DashboardService } from '../../services/dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { IDashboardApiDataModel } from '../../models/dashboard-api-data.model';
import { IListStudentModel } from '../../models/list-student.model';
import { FilterStudentDashboardComponent } from './components/filter-student-dashboard/filter-student-dashboard.component';
import { DialogPurchasedCoursesComponent } from './components/dialog-purchased-courses/dialog-purchased-courses.component';
import { finalize, Subscription } from 'rxjs';
import { IOrderItemModel } from '../../models/order-item.model';
import { EOrderStatusType } from '../../types/order-status.type';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    PaginationShareComponent,
    RouterLink,
    EmptyListComponent,
    MatProgressBarModule,
    DateToPersian,
    ElipsisPipe,
    FilterStudentDashboardComponent
  ],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class StudentListComponent implements OnInit {

  // Input
  @Input() dataDashboard: IDashboardApiDataModel;

  // Subscription
  loadItemSubscription: Subscription;

  // models
  displayedColumns: string[] = [
    'row', 'name', 'lastName',
    'registerDate', 'code',
    'paymentType', 'courses', 'installment', 'identifierName', 'agentShareFromDebtInstallments',
    'agentShareFromPayments', 'agentShareTotal'];

  dataSource: studentDatasourceService = inject(studentDatasourceService);
  filters: IFilterStudentModel = {} as IFilterStudentModel;
  tableData: IListStudentModel[] = [];

  // string
  textSortComponent: string;

  // number
  sortValue: number;
  pageSize: number = 10;
  pageNumber: number = 1;
  totalCount: number = 0;
  loadingItemRow: number | null = null;

  // boolean
  loadingTable: boolean = false;

  // types
  orderStatusType = EOrderStatusType;

  constructor(
    private dashboardService: DashboardService,
    private dialog: MatDialog,
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
      this.textSortComponent = `تعداد کل :  ${this.totalCount} تا`;
      if (!this.shallowEqual(this.filters, this.dashboardService.filter$())) {
        this.filters = this.dashboardService.filter$();
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

  getItemDataCourse(orderId: number): void {
    if (this.loadingItemRow === orderId) return;

    this.loadingItemRow = orderId;
    if (this.loadItemSubscription) {
      this.loadItemSubscription.unsubscribe();
    }
    this.loadItemSubscription = this.dashboardService.getOrderDetail(orderId).pipe(
      finalize(() => { this.loadingItemRow = null; })
    ).subscribe(res => {
      this.showCourseDialog(res);
    })
  }

  showCourseDialog(itemData: IOrderItemModel): void {
    const dialogRef = this.dialog.open(DialogPurchasedCoursesComponent, {
      disableClose: true,
      width: '600px',
      maxWidth: '100vw',
      minHeight: '418px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog',
      autoFocus: false,
    });
    dialogRef.componentInstance.dataDialog = itemData;
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
      }
    });
  }

  //#endregion
}

