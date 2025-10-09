import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '@app/core/config';
import { TablePagingIndex } from '@app/core/models';
import { DynamicSearch } from '@app/core/models/dynamic-search';
import { Observable, map } from 'rxjs';
import { IPayeFilterModel } from '../models/paye-filter.model';
import { IReshteFilterModel } from '../models/reshte-filter.model';

@Injectable({
  providedIn: 'root'
})
export class SettingInfoBaseService {

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private httpClient: HttpClient
  ) { }

  //#region ============== reshte
  getReshteSelect(): Observable<any> {
    let url = `${this.appConfig.apiEndpoint}/Reshte/Select`;
    return this.httpClient.get<any>(url).pipe(
      map(reposnse => reposnse['result'])
    );
  }

  getReshteSelectWithPaye(payeId: number): Observable<any> {
    let url = `${this.appConfig.apiEndpoint}/Reshte/SelectWithPaye?payeId=${payeId}`;
    return this.httpClient.get<any>(url).pipe(
      map(reposnse => reposnse['result'])
    );
  }

  getReshteFilter(searchParams: DynamicSearch<IReshteFilterModel>): Observable<any> {
    let url = `${this.appConfig.apiEndpoint}/Reshte/Filter`;
    return this.httpClient.post<any>(url, searchParams).pipe(
      map(reposnse => reposnse['result'] || ({} as TablePagingIndex<any>))
    );
  }

  //#endregion
  //#region ============== paye
  getPayeSelect(): Observable<any> {
    let url = `${this.appConfig.apiEndpoint}/Paye/Select`;
    return this.httpClient.get<any>(url).pipe(
      map(reposnse => reposnse['result'])
    );
  }

  getPayeSelectWithMaghta(maghtaId: number): Observable<any> {
    let url = `${this.appConfig.apiEndpoint}/Paye/SelectWithMaghta?maghtaId=${maghtaId}`;
    return this.httpClient.get<any>(url).pipe(
      map(reposnse => reposnse['result'])
    );
  }

  getPayeFilter(searchParams: DynamicSearch<IPayeFilterModel>): Observable<any> {
    let url = `${this.appConfig.apiEndpoint}/Paye/Filter`;
    return this.httpClient.post<any>(url, searchParams).pipe(
      map(reposnse => reposnse['result'] || ({} as TablePagingIndex<any>))
    );
  }

  //#endregion

  //#region ============== maghta
  getMaghtaSelect(): Observable<any> {
    let url = `${this.appConfig.apiEndpoint}/Maghta/Select`;
    return this.httpClient.get<any>(url).pipe(
      map(reposnse => reposnse['result'])
    );
  }

  //#endregion

  getDepartmanSelect(): Observable<any> {
    let url = `${this.appConfig.apiEndpoint}/Department/Select`;
    return this.httpClient.get<any>(url).pipe(
      map(reposnse => reposnse['result'])
    );
  }

  getLessonSelect(): Observable<any> {
    let url = `${this.appConfig.apiEndpoint}/Lesson/Select`;
    return this.httpClient.get<any>(url).pipe(
      map(reposnse => reposnse['result'])
    );
  }

  getOstanSelect(): Observable<any> {
    let url = `${this.appConfig.apiEndpoint}/Ostan/Select`;
    return this.httpClient.get<any>(url).pipe(
      map(reposnse => reposnse['result'])
    );
  }
}
