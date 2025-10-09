import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { DynamicSearch } from '@app/core/models/dynamic-search';
import { UserClassService } from '@app/core/services/user-class.service';
import { BehaviorSubject, catchError, of, finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentPopupClassDatasourceService implements DataSource<any> {

  public classStudentSubject = new BehaviorSubject<any[]>([]);
  public classStudent$ = this.classStudentSubject.asObservable();

  private classStudentLengthSource = new BehaviorSubject<number>(0);
  public length$ = this.classStudentLengthSource.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private loadingExcelSubject = new BehaviorSubject<boolean>(false);
  public loadingExcel$ = this.loadingExcelSubject.asObservable();

  id: number;
  private searchParam: DynamicSearch;

  constructor(
    private userClassService: UserClassService
  ) {
    this.searchParam = {
      search: true,
      orderBy: 'Id',
      orderType: 'desc',
      page: 1,
      pageSize: 10
    };
  }

  loadclassStudent(
    id: number,
    pageIndex: number,
    pageSize: number,
    filters: any,
    sort?: any
  ): void {
    this.loadingSubject.next(true);
    // add filters
    this.searchParam.filters = filters;

    // paging
    this.searchParam.page = pageIndex;
    this.searchParam.pageSize = pageSize;

    if (sort) {
      this.searchParam.orderBy = sort.orderBy;
      this.searchParam.orderType = sort.orderType;
    } else {
      this.searchParam.orderBy = 'Id';
      this.searchParam.orderType = 'desc';
    }

    // stringyfily filter
    this.userClassService.getAllStudentClass(this.searchParam, id)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((res: any) => {
        const data = res.records;
        this.classStudentLengthSource.next(res.totalCount);
        this.classStudentSubject.next(data);
      });
  }

  excelclassStudent(
    id: number,
    filters: any,
    className: string
  ): void {
    this.loadingExcelSubject.next(true);
    // add filters
    this.searchParam.filters = filters;

    delete this.searchParam.page;
    delete this.searchParam.pageSize;

    this.userClassService.getExcelAllStudentClass(this.searchParam, id)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingExcelSubject.next(false))
      )
      .subscribe((response: any) => {
        const a = document.createElement('a');
        a.setAttribute('type', 'hidden');
        a.target = '_blank';
        const objectUrl = URL.createObjectURL(response);
        a.href = objectUrl;
        a.download = className;
        a.click();
        a.remove();
        URL.revokeObjectURL(objectUrl);
      });
  }


  connect(): Observable<any[]> {
    return this.classStudentSubject.asObservable();
  }

  disconnect(): void {
    this.classStudentSubject.complete();
    this.loadingSubject.complete();
    this.loadingExcelSubject.complete();
  }
}
