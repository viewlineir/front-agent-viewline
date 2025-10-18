import { computed, Inject, Injectable, signal } from '@angular/core';
import { IListDiscountModel } from '../../../models/list-discount.model';
import { map, Observable } from 'rxjs';
import { IFilterDiscountCodeListModel } from '../models/filter-discount-code-list.model';
import { APP_CONFIG, IAppConfig } from '@app/core/config';
import { HttpClient } from '@angular/common/http';
import { DynamicSearch } from '@app/core/models/dynamic-search';

@Injectable({
  providedIn: 'root'
})
export class AgentCodeService {

  private filterSource = signal<IFilterDiscountCodeListModel>({} as IFilterDiscountCodeListModel);
  public filter$ = computed(() => { return this.filterSource() });

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private httpClient: HttpClient
  ) { }

  updateFilter(filters: IFilterDiscountCodeListModel): void {
    this.filterSource.set(filters);
  }


  getListDiscount(searchParams: DynamicSearch<IFilterDiscountCodeListModel>): Observable<IListDiscountModel> {
    let url = `${this.appConfig.apiEndpoint}/Agent/Dashboard/DiscountCodeList`;
    return this.httpClient.post<any>(url, searchParams).pipe(
      map(reposnse => reposnse['result'])
    );
  }

}
