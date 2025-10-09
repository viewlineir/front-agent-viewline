import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericServiceService {

  private titlePageToolbar = new BehaviorSubject<string>('');
  public titlePageToolbar$ = this.titlePageToolbar.asObservable();

  constructor() { }

  updateTitlePageToolbar(value: string): void {
    this.titlePageToolbar.next(value);
  }
}
