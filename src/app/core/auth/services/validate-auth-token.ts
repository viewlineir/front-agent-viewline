import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { timer, Subscription, BehaviorSubject } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { BrowserStorageService } from '../../services/browser-storage.Service';
import { APP_CONFIG, IAppConfig } from '@app/core/config';

@Injectable({
    providedIn: 'root'
})
export class ValidationAuthTokenUser {

    rememberMeToken = 'rememberMe_token';
    authStatusSource = new BehaviorSubject<boolean>(false);
    authStatus$ = this.authStatusSource.asObservable();
    refreshTokenSubscription: Subscription;

    constructor(private http: HttpClient,
        private browserStorageService: BrowserStorageService,
        @Inject(APP_CONFIG) private appConfig: IAppConfig
    ) { }

    /// Move to Other Class
    isLoggedIn(): boolean {
        const accessToken = this.getRawAuthToken(AuthTokenType.AccessToken);
        const refreshToken = this.getRawAuthToken(AuthTokenType.RefreshToken);
        const hasTokens =
            !this.isEmptyString(accessToken) &&
            !this.isEmptyString(refreshToken);
        return hasTokens;
    }

    isAccessTokenExpired(): boolean {
        const expirationDateUtc = this.getAccessTokenExpirationDateUtc();
        if (!expirationDateUtc) {
            return true;
        }
        return !(expirationDateUtc.valueOf() > new Date().valueOf());
    }

    private isEmptyString(value: string): boolean {
        return !value || 0 === value.length;
    }

    rememberMe(): boolean {
        return (
            this.browserStorageService.getLocal(this.rememberMeToken) === true
        );
    }

    getRawAuthToken(tokenType: AuthTokenType): string {
        return this.browserStorageService.getLocal(
            AuthTokenType[tokenType]
        );
    }

    deleteAuthTokens(): void {

        this.browserStorageService.removeLocal(
            AuthTokenType[AuthTokenType.AccessToken]
        );
        this.browserStorageService.removeLocal(
            AuthTokenType[AuthTokenType.RefreshToken]
        );
        this.browserStorageService.removeLocal("displayName");
        this.browserStorageService.removeLocal("RefreshTokenStatus");
        this.browserStorageService.removeLocal("userInfo");
        this.browserStorageService.removeLocal("DarkMode");
        this.browserStorageService.removeLocal("language");
        this.browserStorageService.removeLocal("userInfoAccount");
        this.browserStorageService.removeLocal(this.rememberMeToken);
    }

    setLoginSession(response: any): void {
        this.setToken(
            AuthTokenType.AccessToken,
            response['result']['access_token']
        );
        this.setToken(
            AuthTokenType.RefreshToken,
            response['result']['refresh_token']
        );
    }

    private setToken(tokenType: AuthTokenType, tokenValue: string): void {

        this.browserStorageService.setLocal(
            AuthTokenType[tokenType],
            tokenValue
        );
    }

    setDisplayName(value: string): void {
        this.browserStorageService.setLocal('displayName', value);
    }
    getDisplayName(): string {
        return 'Kianoush';
    }

    getAccessTokenExpirationDateUtc(): Date {
        const exp = new Date();
        exp.setDate(exp.getDate() + 1);
        return exp;
    }

    scheduleRefreshToken(): void {
        if (!this.isLoggedIn()) {
            return;
        }

        this.unscheduleRefreshToken();

        const expiresAtUtc = this.getAccessTokenExpirationDateUtc().valueOf();
        const nowUtc = new Date().valueOf();
        const initialDelay = Math.max(1, expiresAtUtc - nowUtc);
        // const initialDelay = 3600000 ;
        const timerSource$ = timer(initialDelay);
        this.refreshTokenSubscription = timerSource$.subscribe(() => {
            this.refreshToken();
        });
    }

    unscheduleRefreshToken(): void {
        if (this.refreshTokenSubscription) {
            this.refreshTokenSubscription.unsubscribe();
        }
    }

    refreshToken(): Subscription {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const model = { refreshToken: this.getRawAuthToken(AuthTokenType.RefreshToken) };
        return this.http
            .post(`${this.appConfig.apiEndpoint}/${this.appConfig.refreshTokenPath}`, model, { headers: headers })
            .pipe(finalize(() => {
                this.scheduleRefreshToken();
            })).pipe(map(response => response || {}))
            .subscribe(result => {
                this.setLoginSession(result);
            });
    }

    isAuthUserInRole(requiredPermission: string): boolean {
        const permissions = this.browserStorageService.getUserInformation();
        let hasPermission = false;
        for (let i = 0; i < permissions.length; i++) {
            if (permissions[i] === requiredPermission) {
                hasPermission = true;
                break;
            }
        }
        return hasPermission;
    }
}

export enum AuthTokenType {
    AccessToken,
    RefreshToken
}
