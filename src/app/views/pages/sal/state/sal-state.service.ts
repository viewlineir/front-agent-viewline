import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ISalSelectModel } from '../models/sal-select.model';

@Injectable({
  providedIn: 'root'
})
export class SalStateService {
  private salSelectListResult = new BehaviorSubject<ISalSelectModel[]>([]);
  public salSelectListResult$ = this.salSelectListResult.asObservable();

  constructor() { }

  updateSalSelectResult(value: ISalSelectModel[]): void {
    this.salSelectListResult.next(value);
  }
}
