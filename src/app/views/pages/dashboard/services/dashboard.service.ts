import { HttpClient } from '@angular/common/http';
import { computed, Inject, Injectable, signal } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '@app/core/config';
import { Observable, map } from 'rxjs';
import { IFilterStudentModel } from '../models/filter-student.model';
import { DynamicSearch } from '@app/core/models/dynamic-search';
import { TablePagingIndex } from '@app/core/models';
import { IOrderItemModel } from '../models/order-item.model';
import { IListDiscountModel } from '../models/list-discount.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private filterSource = signal<IFilterStudentModel>({} as IFilterStudentModel);
  public filter$ = computed(() => { return this.filterSource() });

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private httpClient: HttpClient
  ) { }

  updateFilter(filters: IFilterStudentModel): void {
    this.filterSource.set(filters);
  }

  getData(): Observable<any> {
    let url = `${this.appConfig.apiEndpoint}/Agent/Dashboard`;
    return this.httpClient.get<any>(url).pipe(
      map(reposnse => reposnse['result'])
    );
  }

  getStudentList(searchParams: DynamicSearch<IFilterStudentModel>): Observable<any> {
    let url = `${this.appConfig.apiEndpoint}/Agent/Dashboard/StudentList`;
    return this.httpClient.post<any>(url, searchParams).pipe(
      map(reposnse => reposnse['result'] || ({} as TablePagingIndex<any>))
    );
  }

  getOrderDetail(orderId: number): Observable<IOrderItemModel> {
    let url = `${this.appConfig.apiEndpoint}/Agent/Dashboard/Order/Details/${orderId}`;
    return this.httpClient.get<any>(url).pipe(
      map(reposnse => reposnse['result'])
    );
  }

  getListDiscount(): Observable<IListDiscountModel> {
    const searchParam = {
      search: true,
      filters: {},
      orderBy: 'Id',
      orderType: 'desc',
      page: 1,
      pageSize: 100
    };
    let url = `${this.appConfig.apiEndpoint}/Agent/Dashboard/DiscountCodeList`;
    return this.httpClient.post<any>(url, searchParam).pipe(
      map(reposnse => reposnse['result'])
    );
  }

}
