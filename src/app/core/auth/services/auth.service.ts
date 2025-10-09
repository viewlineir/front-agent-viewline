import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ValidationAuthTokenUser } from './validate-auth-token';
import { Credentials } from './models/credentials';
import { SendTokenValue } from '../../models/send-refreshToken-value';
import { User } from './models/user.model';
import { BrowserStorageService } from '../../services/browser-storage.Service';
import { AlertService } from '@app/core/services';
import { APP_CONFIG, IAppConfig } from '@app/core/config';
import { UserInfoService } from '@app/core/services/userInfo.service';
import { IResultForMoveStepsModel } from '@app/views/pages/auth/models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private resultSendCode = new BehaviorSubject<IResultForMoveStepsModel>({} as IResultForMoveStepsModel);
    public resultSendCode$ = this.resultSendCode.asObservable();

    constructor(
        private http: HttpClient,
        private authService: ValidationAuthTokenUser,
        private alertService: AlertService,
        private router: Router,
        private userInfoService: UserInfoService,
        private browserStorageService: BrowserStorageService,
        @Inject(APP_CONFIG) private appConfig: IAppConfig
    ) { }

    updateResultSendCode(data: IResultForMoveStepsModel): void {
        this.resultSendCode.next(data);
    }

    login(credentials: Credentials): Observable<any> {

        this.authService.deleteAuthTokens();
        let value = {
            userName: credentials.userName,
            password: credentials.password,
            captchaCode: credentials.captchaCode
        }

        return this.http.post<User>(this.appConfig.apiEndpoint + '/Account/Agent/Login', value).pipe(
            map((response: any) => {
                if (!response['success']) {
                    this.authService.authStatusSource.next(false);
                    this.alertService.snackBarError(response['message']);
                    return null;
                }
                return this.SetToken(response);
            })
        )
    }

    SetToken(response: any): Promise<string> {
        return new Promise((resolve) => {
            const res = response['result'];
            if (res.twoFactorAuth) {
                this.alertService.snackBarSuccess(res.sendCodeMessage);
                resolve(res.twoFactorHash);
            }
            else {
                this.authService.setLoginSession(response);
                this.getUserInformation();
            }
        });
    }

    getUserInformation(): void {
        let url = `${this.appConfig.apiEndpoint}/Account/UserInformation`
        this.http.get(url).pipe(
            map(res => res)
        ).subscribe((res: any) => {
            if (res.success === true) {
                let userInfo = {
                    id: res['result']['id'],
                    hasAvatar: res['result']['hasAvatar'],
                    avatar: res['result']['avatar'],
                    gender: res['result']['gender'],
                    displayName: res['result']['displayName'],
                }
                this.userInfoService.updateResultUserInfo(userInfo);
                this.browserStorageService.setLocal("userInfoAccount", userInfo);
                this.browserStorageService.setLocal("userInfo", res['result']['claims']);
                this.browserStorageService.setLocal("RefreshTokenStatus", false);
            }
        });
    }

    logout(): void {
        this.authService.deleteAuthTokens();
        this.authService.authStatusSource.next(false);
        this.router.navigate(['/auth/login']);
    }

    logOut(item: SendTokenValue): Observable<boolean> {
        localStorage.removeItem('displayName');
        return this.http.post<boolean>(this.appConfig.apiEndpoint + '/Account/Logout', item).pipe(
            map((res: any) => {
                if (res) {
                    return res;
                }
            })
        );
    }

    SendCodeAgain(value: string): Observable<any> {
        return this.http.post<any>(this.appConfig.apiEndpoint + '/Account/TwoFactor/SendCode', { value: value })
            .pipe(
                map(res => {
                    if (res['success']) {
                        this.alertService.snackBarSuccess(res['message']);
                    }
                })
            )
    }

    sendConfirmCodeRequest(item: any): Observable<any> {
        return this.http.post<any>(this.appConfig.apiEndpoint + '/account/TwoFactor/Verify', item).pipe(
            map(res => {
                if (res['success']) {
                    this.SetToken(res);
                    return true;
                } else {
                    this.alertService.snackBarError(res['message']);
                    return false;
                }
            })
        );
    }

    getUserByToken(): Observable<any> {
        const auth = this.getAuthFromLocalStorage();
        if (!auth || !auth.accessToken) {
            return of(undefined);
        }
        return auth;
    }

    private getAuthFromLocalStorage(): any {
        try {
            const authData = JSON.parse(
                localStorage.getItem("AccessToken")
            );
            return authData;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    async isAuthUserInRole(requiredPermission: string): Promise<boolean> {
        let items: any;
        let hasPermission = false;
        if (requiredPermission.indexOf('-') > 0) {
            items = requiredPermission.split('-');
        }

        const permissions = await this.browserStorageService.getUserInformationPromise()
            .then(data => {
                if (data && items) {
                    data.forEach(element => {
                        for (let i = 0; i < items.length; i++) {
                            if (element === items[i]) {
                                hasPermission = true;
                                break;
                            }
                        }
                    });
                } else if (data) {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i] === requiredPermission) {
                            hasPermission = true;
                            break;
                        }
                    }
                }
                return hasPermission;
            });
        return await permissions;
    }
}

export enum AuthTokenType {
    AccessToken,
    RefreshToken
}
