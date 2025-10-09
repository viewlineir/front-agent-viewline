import { Injectable } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardResolverService {

  constructor(
    private dashboardService: DashboardService
  ) { }

  resolve(): Observable<any> | Promise<any> | any {
    return this.dashboardService.getData().pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
        return null;
      })
    );
  }
}
