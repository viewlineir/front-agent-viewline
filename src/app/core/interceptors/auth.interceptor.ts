
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';
import { BrowserStorageService } from '../services/browser-storage.Service';
import { ValidationAuthTokenUser, AuthTokenType } from '../auth/services/validate-auth-token';
import { AlertService, UtilsService } from '../services';
import { APP_CONFIG, IAppConfig } from '../config';
import { ISalSelectModel } from '@app/views/pages/sal/models/sal-select.model';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	private authorizationHeader = 'Authorization';
	private refreshTokenInProgress = false;
	private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	private requestQueue: Subject<boolean> = new Subject<boolean>();

	constructor(
		@Inject(APP_CONFIG) private appConfig: IAppConfig,
		private browserStorageService: BrowserStorageService,
		private validateToken: ValidationAuthTokenUser,
		private authService: AuthService,
		private utilService: UtilsService,
		private alertService: AlertService,
		private router: Router,
		private http: HttpClient
	) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		if (!this.utilService.chekcIfConnection()) {
			this.alertService.snackBarError('شما یه اینترنت متصل نیستید');
			return throwError('Lost Connection');

		}

		const accessToken = this.validateToken.getRawAuthToken(AuthTokenType.AccessToken);
		if (!accessToken) {
			// login page
			if (window.location.href.includes('/auth/')) {
				return next.handle(request);
			} else {
				this.authService.logout();
			}
		}

		if (!this.isFormData(request)) {
			let headers = new HttpHeaders({
				'Authorization': `Bearer ${accessToken}`,
				'version': '1',
			});
			request = request.clone({
				headers
			});
		} else {
			let headers = new HttpHeaders({
				'Authorization': `Bearer ${accessToken}`,
				'version': '1',
			});
			request = request.clone({
				headers
			});
		}


		return next.handle(request).pipe(
			catchError((error: any, caught: Observable<HttpEvent<any>>) => {
				// if (error instanceof HttpErrorResponse) {

				if (this.isRefreshToken(request) && error.status === 401) {
					this.refreshTokenInProgress = false;
					this.authService.logout();
				}

				if (error.status === 401) {
					return this.handleRefreshToken(request, next);
				}
				else if (error.status === 403) {
					this.router.navigate(['/forbidden']);
				} else if (error.status === 503) {
					this.alertService.snackBarError('در سرور خطایی رخ داده است  . دوباره تلاش کنید');
					(error);
					this.alertService.snackBarError('در سرور خطایی رخ داده است  . دوباره تلاش کنید');
				} else if (error.status === 505) {
					this.alertService.snackBarError('در سرور خطایی رخ داده است  . دوباره تلاش کنید');
					(error);
				}
				else if (error.status === 405) {
					this.alertService.snackBarError('در سرور خطایی رخ داده است  . دوباره تلاش کنید');
					(error);
				}
				// } else {
				// 	this.alertService.snackBarError('یک خطای ناشناخته رخ داد. لطفا دوباره تلاش کنید.');
				// }
				return throwError(error);
			})
		);
	}

	handleRefreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
		if (this.refreshTokenInProgress) {
			// Queue the request and wait for the token refresh to complete
			return new Observable(observer => {
				this.requestQueue.subscribe(() => {
					observer.next();
					observer.complete();
				});
			}).pipe(
				switchMap(() => next.handle(this.getNewAuthRequest(request) || request))
			);
		} else {
			this.refreshTokenInProgress = true;
			this.refreshTokenSubject.next(null);

			const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'version': '1' });
			const model = { value: this.validateToken.getRawAuthToken(AuthTokenType.RefreshToken) };
			const url = `${this.appConfig.apiEndpoint}/${this.appConfig.refreshTokenPath}`;

			return this.http.post(url, model, { headers }).pipe(
				switchMap((result: any) => {
					this.refreshTokenInProgress = false;
					this.refreshTokenSubject.next(result);

					this.validateToken.setLoginSession(result);

					// Replay queued requests
					this.requestQueue.next(true);  // Passing a dummy value
					this.requestQueue.complete();

					// Create a new Subject for future requests
					this.requestQueue = new Subject<boolean>();

					return next.handle(this.getNewAuthRequest(request) || request);
				}),
				catchError((error: any) => {
					this.refreshTokenInProgress = false;
					this.authService.logout();
					return throwError(error);
				})
			);
		}
	}

	// hanldeRequest(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
	// 	const newRequest = this.getNewAuthRequest(request);
	// 	if (newRequest) {
	// 		return next.handle(newRequest);
	// 	}
	// 	this.router.navigate(['/auth/login']);
	// 	return of(null)
	// }

	getNewAuthRequest(request: HttpRequest<any>): HttpRequest<any> | null {
		const newStoredToken = this.validateToken.getRawAuthToken(AuthTokenType.AccessToken);
		const requestAccessTokenHeader = request.headers.get(this.authorizationHeader);
		if (!newStoredToken || !requestAccessTokenHeader) {
			return null;
		}
		const newAccessTokenHeader = `Bearer ${newStoredToken}`;

		if (requestAccessTokenHeader === newAccessTokenHeader) {
			return null;
		}
		return request.clone({ headers: request.headers.set(this.authorizationHeader, newAccessTokenHeader) });
	}

	private isFormData(req: HttpRequest<any>): boolean {
		const url = req.url;
		if (
			url.endsWith('/Class')
		) {
			return true;
		}

		return false;
	}

	private isRefreshToken(req: HttpRequest<any>): boolean {
		const url = req.url;
		if (
			url.endsWith(`${this.appConfig.refreshTokenPath}`)
		) {
			return true;
		}

		return false;
	}
}
