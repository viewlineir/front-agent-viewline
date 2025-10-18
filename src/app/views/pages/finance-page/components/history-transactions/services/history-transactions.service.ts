import { computed, Inject, Injectable, signal } from '@angular/core';
import { IFilterHistoryTransactionsListModel } from '../models/filter-history-transactions-list.model';
import { APP_CONFIG, IAppConfig } from '@app/core/config';
import { HttpClient } from '@angular/common/http';
import { DynamicSearch } from '@app/core/models/dynamic-search';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryTransactionsService {


  private filterSource = signal<IFilterHistoryTransactionsListModel>({} as IFilterHistoryTransactionsListModel);
  public filter$ = computed(() => { return this.filterSource() });

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private httpClient: HttpClient
  ) { }

  updateFilter(filters: IFilterHistoryTransactionsListModel): void {
    this.filterSource.set(filters);
  }


  getList(searchParams: DynamicSearch<IFilterHistoryTransactionsListModel>): Observable<any> {
    let url = `${this.appConfig.apiEndpoint}/Agent/UserPayout/GetAll`;
    return this.httpClient.post<any>(url, searchParams).pipe(
      map(reposnse => reposnse['result'])
    );
  }


}
