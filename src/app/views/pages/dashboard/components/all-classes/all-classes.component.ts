import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ISearchClassModel } from './models/search-class.model';
import { AllClassDatasourceService } from './services/all-class-datasource.service';
import { AllClassService } from './services/all-class.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { EmptyListComponent } from '@app/shared/components/empty-list/empty-list.component';
import { PaginationShareComponent } from '@app/shared/components/pagination-share/pagination-share.component';
import { DateToPersian, ElipsisPipe } from '@app/shared/pipes';
import { FilterAllClassComponent } from './components/filter-all-class/filter-all-class.component';
import { DialogStudentClassComponent } from './components/dialog-student-class/dialog-student-class.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-all-classes',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    PaginationShareComponent,
    RouterLink,
    EmptyListComponent,
    MatIconModule,
    MatProgressBarModule,
    DateToPersian,
    FilterAllClassComponent,
    ElipsisPipe
  ],
  templateUrl: './all-classes.component.html',
  styleUrl: './all-classes.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AllClassesComponent implements OnInit {
  // models
  displayedColumns: string[] = [
    'title', 'time_day', 'startDate',
    'tedadJalasat', 'jalasatBargozarShode',
    'tedatSabteNami', 'students'];

  dataSource: AllClassDatasourceService;
  filters = {} as ISearchClassModel;

  // string
  textSortComponent: string;

  // number
  sortValue: number;
  pageSize: number = 10;
  pageNumber: number = 1;
  totalCount: number = 0;

  // types

  constructor(
    private allClassService: AllClassService,
    private dialog: MatDialog,
  ) {
    this.dataSourceInit();
  }
  //==================================
  // #region LIFE CYCLE HOOK 
  //==================================
  ngOnInit(): void {
    this.applyFilter();
  }

  //#endregion
  //==================================
  // #region PRIVATE 
  //==================================
  private loadDataSource(): void {
    this.dataSource.loadclasses(
      this.pageNumber,
      this.pageSize,
      this.filters
    );
  }

  private dataSourceInit(): void {
    this.dataSource = new AllClassDatasourceService(this.allClassService);
    this.dataSource.loadclasses(
      this.pageNumber,
      this.pageSize,
      this.filters
    );
  }

  private applyFilter(): void {
    this.pageNumber = 1;
    this.allClassService.filter$.subscribe(
      res => {
        this.filters = res;
        this.loadDataSource();
      }
    )
  }

  //#endregion
  //==================================
  // #region PUBLIC 
  //==================================
  pageNumberSelected(event: number): void {
    this.pageNumber = event;
    this.loadDataSource();
  }

  listStudentClass(item: any): void {
    const dialogRef = this.dialog.open(DialogStudentClassComponent, {
      disableClose: true,
      width: '80vw',
      maxWidth: '100vw',
      height: '80vh',
      maxHeight: '90vh',
      panelClass: 'custom-dialog',
      autoFocus: false,
      data: item
    });
    dialogRef.componentInstance.titleClass = item.classTitle;
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
      }
    });
  }
  //#endregion
}

