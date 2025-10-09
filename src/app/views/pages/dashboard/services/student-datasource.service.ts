import { computed, Injectable, signal } from '@angular/core';
import { DynamicSearch } from '@app/core/models/dynamic-search';
import { finalize } from 'rxjs';
import { IFilterStudentModel } from '../models/filter-student.model';
import { DashboardService } from './dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class studentDatasourceService {


  private dataSource = signal<any[]>([]);
  public dataSource$ = computed(() => { return this.dataSource() });

  private LengthSource = signal<number>(0);
  public length$ = computed(() => { return this.LengthSource() });


  private loadingSubject = signal<boolean>(false);
  public loading$ = computed(() => { return this.loadingSubject() });

  private searchParam: DynamicSearch<IFilterStudentModel>;

  constructor(
    private dashboardService: DashboardService
  ) {
    this.searchParam = {
      search: true,
      orderBy: 'Id',
      orderType: 'desc',
      page: 1,
      pageSize: 10
    };
  }

  updateDataSource(value: any): void {
    this.dataSource.set(value);
  }

  load(
    pageNumber: number,
    pageSize: number,
    filters: IFilterStudentModel
  ): void {
    this.loadingSubject.set(true);
    // add filters
    this.searchParam.filters = filters;

    // paging
    this.searchParam.page = pageNumber;
    this.searchParam.pageSize = pageSize;

    this.dashboardService.getStudentList(this.searchParam)
      .pipe(
        finalize(() => this.loadingSubject.set(false))
      )
      .subscribe((res: any) => {
        this.LengthSource.set(res.totalCount);
        this.dataSource.set(res.records);
      });
  }
}
