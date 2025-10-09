import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadCheckForHeaderService {
  private isPageReloaded = new BehaviorSubject<boolean>(true);
  public isPageReloaded$ = this.isPageReloaded.asObservable();

  constructor() {
    this.updateIsPageReloaded(true);
  }

  updateIsPageReloaded(value: boolean): void {
    this.isPageReloaded.next(value);
  }

}
