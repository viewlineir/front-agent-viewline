import { Injectable } from '@angular/core';
import { ISearchClassModel } from '../models/search-class.model';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { AllClassService } from './all-class.service';
import { DynamicSearch } from '@app/core/models/dynamic-search';

@Injectable({
  providedIn: 'root'
})
export class AllClassDatasourceService implements DataSource<any> {

  public classesSubject = new BehaviorSubject<any[]>([]);
  public classes$ = this.classesSubject.asObservable();

  private classesLengthSource = new BehaviorSubject<number>(0);
  public length$ = this.classesLengthSource.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private searchParam: DynamicSearch;

  constructor(
    private allClassService: AllClassService
  ) {
    this.searchParam = {
      search: true,
      orderBy: 'Id',
      orderType: 'desc',
      page: 1,
      pageSize: 10
    };
  }

  loadclasses(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): void {
    this.loadingSubject.next(true);
    // add filters
    this.searchParam.filters = filters;

    // paging
    this.searchParam.page = pageIndex;
    this.searchParam.pageSize = pageSize;

    this.allClassService.getList(this.searchParam)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((res: any) => {
        const data = res.records;
        this.classesLengthSource.next(res.totalCount);
        this.classesSubject.next(data);
      });
  }


  connect(): Observable<any[]> {
    return this.classesSubject.asObservable();
  }

  disconnect(): void {
    this.classesSubject.complete();
    this.loadingSubject.complete();
  }
}