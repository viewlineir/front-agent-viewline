import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private navigationAction = new BehaviorSubject<boolean>(false);
  public navigationAction$ = this.navigationAction.asObservable();

  constructor() { }

  updateNavigationAction(value: boolean): void {
    this.navigationAction.next(value)
  }
}
