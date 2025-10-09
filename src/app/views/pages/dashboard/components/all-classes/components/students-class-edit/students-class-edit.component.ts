import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { PaginationShareComponent } from '@app/shared/components/pagination-share/pagination-share.component';
import { StudentClassFilterComponent } from './student-class-filter/student-class-filter.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { UserClassService } from '@app/core/services/user-class.service';
import { StudentClassPopupService } from './services/student-class-popup.service';
import { EmptyListComponent } from '@app/shared/components/empty-list/empty-list.component';
import { DateToPersian } from '@app/shared/pipes';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { StudentPopupClassDatasourceService } from './services/student-popup-class-datasource.service';
import { IFilterStudentClassModel } from './models/filter-student-model';
import { ISortModel } from '@app/core/models/sort.model';

@Component({
  selector: 'app-students-class-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    StudentClassFilterComponent,
    PaginationShareComponent,
    RouterLink,
    MatIconModule,
    MatSortModule,
    EmptyListComponent,
    DateToPersian,
    MatProgressBarModule,
  ],
  templateUrl: './students-class-edit.component.html',
  styleUrl: './students-class-edit.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class StudentsClassEditComponent implements OnInit {


  // ViewChild
  @ViewChild(MatSort) sort: MatSort;

  // Input
  @Input() idClass: number;
  @Input() title: string;

  // models
  displayedColumns: string[] = [
    'row', 'pictureProfile', 'firstName', 'lastName',
    'registerDate', 'mobile'];
  dataSource: StudentPopupClassDatasourceService;
  filters = {} as IFilterStudentClassModel;

  sortSelected: ISortModel;

  // number
  sortValue: number;
  pageSize: number = 10;
  pageNumber: number = 1;
  totalCount: number = 68;

  constructor(
    private userClassService: UserClassService,
    private studentClassPopupService: StudentClassPopupService,
  ) {
  }
  //==================================
  // #region LIFE CYCLE HOOK 
  //==================================
  ngOnInit(): void {
    this.dataSourceInit();
    this.applyFilter();
  }

  //#endregion
  //==================================
  // #region PRIVATE 
  //==================================
  private loadDataSource(): void {
    this.dataSource.loadclassStudent(
      this.idClass,
      this.pageNumber,
      this.pageSize,
      this.filters,
      this.sortSelected
    );
  }

  private dataSourceInit(): void {
    this.dataSource = new StudentPopupClassDatasourceService(this.userClassService);
    this.dataSource.loadclassStudent(this.idClass, 1, this.pageSize, this.filters);
  }

  private applyFilter(): void {
    this.pageNumber = 1;
    this.studentClassPopupService.filter$
      .pipe()
      .subscribe(filters => {
        this.filters = filters;
        this.pageNumber = 1;
        this.sortSelected = undefined;
        this.sort.sort({ id: '', start: 'desc', disableClear: false });
        this.loadDataSource();
      });
  }
  //#endregion
  //==================================
  // #region PUBLIC 
  //==================================
  downloadExcel(): void {
    this.dataSource.excelclassStudent(this.idClass, this.filters, this.title);
  }

  pageNumberSelected(event: number): void {
    this.pageNumber = event;
    this.loadDataSource();
  }

  sortData(sort: Sort): void {
    this.sortSelected = {
      orderBy: sort.active,
      orderType: sort.direction
    }
    
    switch (sort.active) {
      case 'registerDate':
        this.sortSelected.orderBy = 'registerDate';
        break;

      default:
        this.sortSelected.orderBy = 'Id';
        this.sortSelected.orderType = 'desc';
        break;
    }
    this.dataSource.loadclassStudent(
      this.idClass,
      this.pageNumber,
      this.pageSize,
      this.filters,
      this.sortSelected
    );
  }
  //#endregion
}
