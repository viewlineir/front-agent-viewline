import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '@app/core/config';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalService {

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private httpClient: HttpClient
  ) { }

  getSalSelect(): Observable<any> {
    let url = `${this.appConfig.apiEndpoint}/Sal/Select`;
    return this.httpClient.get<any>(url).pipe(
      map(reposnse => reposnse['result'])
    );
  }
}
