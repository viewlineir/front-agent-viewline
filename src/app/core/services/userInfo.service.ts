import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserInfo } from 'src/app/core/models/user-info';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { APP_CONFIG, IAppConfig } from '../config';


@Injectable({
	providedIn: 'root'
})
export class UserInfoService {

	private resultUserInfo = new BehaviorSubject<UserInfo>({} as UserInfo);
	public resultUserInfo$ = this.resultUserInfo.asObservable();

	constructor(
		private httpClient: HttpClient,
		@Inject(APP_CONFIG) private appConfig: IAppConfig
	) { }

	updateResultUserInfo(data: UserInfo): void {
		this.resultUserInfo.next(data);
	}


	getImage(): Observable<any> {
		return this.httpClient
			.get(this.appConfig.apiEndpoint + '/Profile/ShowAvatar/100', { responseType: 'blob' })
			.pipe(
				map(res => {
					if (res) {
						return res;
					}
					return null;
				})
			)
	}

}
