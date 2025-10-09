import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { createDateProvider, getDateFormat } from '../adapter/date-adapte-creator';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatDatepickerModule,
  ],
  exports: [
    MatDatepickerModule,
  ],
  providers: [
    { provide: DateAdapter, useFactory: createDateProvider, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useFactory: getDateFormat },
  ]
})
export class DatepickerImportsModule { }
