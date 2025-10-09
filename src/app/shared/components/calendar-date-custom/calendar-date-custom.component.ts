import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DateToPersian } from '@app/shared/pipes';
import { DateUtilsService } from './services/date-utils.service';
import { DatepickerImportsModule } from '@app/shared/modules/datepicker-imports.module';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-calendar-date-custom',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    DateToPersian,
    DatepickerImportsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './calendar-date-custom.component.html',
  styleUrl: './calendar-date-custom.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CalendarDateCustomComponent implements OnInit, OnChanges {
  // Output 
  @Output() dateSelected = new EventEmitter<Date>();

  // Input
  @Input() resetFilter: boolean = false;

  // models
  selectedDate = new Date();
  datesBeforeToday: Date[];
  datesAfterToday: Date[];
  weekListDate: Date[] = [];

  constructor(
    private matIconRegistry: MatIconRegistry,
    private _sanitizer: DomSanitizer,
    private dateUtils: DateUtilsService,
    private cdRef: ChangeDetectorRef
  ) {
    this.handleIconSvg();
  }

  //==================================
  // #region LIFE CYCLE HOOK
  //==================================
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['resetFilter']) {
      if (changes['resetFilter'].currentValue === true) {
        this.selectedDate = new Date();
        this.fillWeekListBySelectDate();
      }
    }
  }

  ngOnInit(): void {
    this.fillWeekListBySelectDate();
  }

  //#endregion

  //==================================
  // #region PUBLIC 
  //==================================
  onDateSelect(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = new Date(event.value);
    this.dateSelected.emit(this.selectedDate);
    this.fillWeekListBySelectDate();
  }

  changeDate(item: Date): void {
    this.selectedDate = new Date(item);
    this.dateSelected.emit(this.selectedDate);
  }

  areDatesEqual(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  goToPreviousWeek(): void {
    const startOfPreviousWeek = new Date(this.weekListDate[0].getTime());
    startOfPreviousWeek.setDate(startOfPreviousWeek.getDate() - 7);
    this.fillWeekListByChangeArrow(startOfPreviousWeek);
  }

  goToNextWeek(): void {
    const startOfNextWeek = new Date(this.weekListDate[this.weekListDate.length - 1].getTime());
    startOfNextWeek.setDate(startOfNextWeek.getDate() + 1);
    this.fillWeekListByChangeArrow(startOfNextWeek);
  }

  //#endregion

  //==================================
  // #region PRIVATE 
  //==================================
  private handleIconSvg(): void {
    this.matIconRegistry.addSvgIcon(
      'calendar_today',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/calendar_today.svg')
    );
  }

  private fillWeekListBySelectDate(): void {
    const daysAroundToday = this.dateUtils.getDaysBeforeAndAfter(this.selectedDate, 6, 'Saturday');
    this.datesBeforeToday = daysAroundToday.before;
    this.datesAfterToday = daysAroundToday.after;
    this.weekListDate = [];
    this.weekListDate = [...this.datesBeforeToday, this.selectedDate, ...this.datesAfterToday];
    this.cdRef.detectChanges();
  }

  private fillWeekListByChangeArrow(item: Date): void {
    const daysAroundToday = this.dateUtils.getDaysBeforeAndAfter(item, 6, 'Saturday');
    this.datesBeforeToday = daysAroundToday.before;
    this.datesAfterToday = daysAroundToday.after;
    this.weekListDate = [];
    this.weekListDate = [...this.datesBeforeToday, item, ...this.datesAfterToday];
    this.cdRef.detectChanges();
  }

  //#endregion

}
