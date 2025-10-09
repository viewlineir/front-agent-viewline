import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '@app/core/config';
import { TablePagingIndex } from '@app/core/models';
import { Observable, Subject, map } from 'rxjs';
import { ISearchClassModel } from '../models/search-class.model';
import { DynamicSearch } from '@app/core/models/dynamic-search';

@Injectable({
  providedIn: 'root'
})
export class AllClassService {

  private filterSource = new Subject<ISearchClassModel>();
  public filter$ = this.filterSource.asObservable();

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private httpClient: HttpClient
  ) { }

  getList(searchParams: DynamicSearch): Observable<any> {
    let url = `${this.appConfig.apiEndpoint}/Teacher/Dashboard/MyClass`;
    return this.httpClient.post<any>(url, searchParams).pipe(
      map(reposnse => reposnse['result'] || ({} as TablePagingIndex<any>))
    );
  }


  updateFilter(filters: ISearchClassModel): void {
    this.filterSource.next(filters);
  }


}
