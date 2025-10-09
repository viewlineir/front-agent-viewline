import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IFilterStudentClassModel } from '../models/filter-student-model';

@Injectable({
  providedIn: 'root'
})
export class StudentClassPopupService {

  private filterSource = new Subject<IFilterStudentClassModel>();
  public filter$ = this.filterSource.asObservable();
  
  constructor() { }

  updateFilter(filters: IFilterStudentClassModel): void {
    this.filterSource.next(filters);
  }
}
