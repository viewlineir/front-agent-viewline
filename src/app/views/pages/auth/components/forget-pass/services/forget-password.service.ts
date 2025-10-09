import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '@app/core/config';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { IResultForMoveStepsModel } from '../models/result-move-step.model';

@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService {

  private resultSendCode = new BehaviorSubject<IResultForMoveStepsModel>({} as IResultForMoveStepsModel);
  public resultSendCode$ = this.resultSendCode.asObservable();

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private httpClient: HttpClient
  ) { }

  updateResultSendCode(data: IResultForMoveStepsModel): void {
    this.resultSendCode.next(data);
  }

  sendCode(value: any): Observable<any> {
    console.log(value)
    let url = `${this.appConfig.apiEndpoint}/ForgotPassword/SendCode`;
    return this.httpClient.post<any>(url, value).pipe(
      map(reposnse => reposnse['result'])
    );
  }

  verifyCode(value: any): Observable<any> {
    let url = `${this.appConfig.apiEndpoint}/ForgotPassword/VerifyCode`;
    return this.httpClient.post<any>(url, value).pipe(
      map(reposnse => reposnse)
    );
  }

  changePassword(value: any): Observable<any> {
    let url = `${this.appConfig.apiEndpoint}/ForgotPassword/ChangePassword`;
    return this.httpClient.post<any>(url, value).pipe(
      map(reposnse => reposnse)
    );
  }

}
