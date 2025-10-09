import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ResponseError } from '../models/reponse-error';
import { AlertService } from '../services';

@Injectable()
export class HttpInterceptorServise implements HttpInterceptor {
	constructor(
		private alertService: AlertService
	) { }

	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			map((res: any) => {
				if (res['body']) {
					if (res['body']['success'] !== undefined) {
						if (res['body']['success'] === false) {
							this.alertService.snackBarError(res['body']['message']);
							const error = new ResponseError();
							error.data = res['body'];
							throw error;
						}
					}
				}
				return res;
			})
		);
	}

	private notHaveStructureUrl(req: HttpRequest<any>): boolean {
		const url = req.url.toLocaleLowerCase();
		if (
			(url.indexOf('/student/') > 0 && req.method === "GET")
		) {
			return true;
		}

		return false;
	}
}
