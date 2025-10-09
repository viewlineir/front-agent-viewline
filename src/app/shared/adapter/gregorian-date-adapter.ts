
import { Injectable, InjectionToken } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Moment, MomentFormatSpecification, MomentInput } from 'moment';

import _moment from 'moment';

const moment = _moment;

/* Configurable options for {@see MomentDateAdapter}. */
export interface MatMomentDateAdapterOptions {

  /**
   * When enabled, the dates have to match the format exactly.
   * See https://momentjs.com/guides/#/parsing/strict-mode/.
   */
  strict?: boolean;

  /**
   * Turns the use of utc dates on or off.
   * Changing this will change how Angular Material components like DatePicker output dates.
   * {@default false}
   */
  useUtc?: boolean;
}

export const MAT_MOMENT_DATE_ADAPTER_OPTIONS = new InjectionToken<MatMomentDateAdapterOptions>(
  'MAT_MOMENT_DATE_ADAPTER_OPTIONS', {
  providedIn: 'root',
  factory: MAT_MOMENT_DATE_ADAPTER_OPTIONS_FACTORY
});

export function MAT_MOMENT_DATE_ADAPTER_OPTIONS_FACTORY(): MatMomentDateAdapterOptions {
  return {
    useUtc: false
  };
}

function range<T>(length: number, valueFunction: (index: number) => T): T[] {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}

@Injectable()
export class GregorianDateAdapter extends DateAdapter<Moment> {

  private _localeData: {
    firstDayOfWeek: number,
    longMonths: string[],
    shortMonths: string[],
    dates: string[],
    longDaysOfWeek: string[],
    shortDaysOfWeek: string[],
    narrowDaysOfWeek: string[]
  };

  constructor() {
    super();
    this.setLocale(moment.locale());
  }

  override setLocale(locale: string) {
    super.setLocale(locale);

    let momentLocaleData = moment.localeData(locale);
    this._localeData = {
      firstDayOfWeek: momentLocaleData.firstDayOfWeek(),
      longMonths: momentLocaleData.months(),
      shortMonths: momentLocaleData.monthsShort(),
      dates: range(31, (i) => this.createDate(2017, 0, i + 1).format('D')),
      longDaysOfWeek: momentLocaleData.weekdays(),
      shortDaysOfWeek: momentLocaleData.weekdaysShort(),
      narrowDaysOfWeek: momentLocaleData.weekdaysMin(),
    };
  }

  getYear(date: Moment): number {
    return this.clone(date).utc(true).year();
  }

  getMonth(date: Moment): number {
    return this.clone(date).utc(true).month();
  }

  getDate(date: Moment): number {
    return this.clone(date).utc(true).date();
  }

  getDayOfWeek(date: Moment): number {
    return this.clone(date).utc(true).day();
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    // Moment.js doesn't support narrow month names, so we just use short if narrow is requested.
    return style == 'long' ? this._localeData.longMonths : this._localeData.shortMonths;
  }

  getDateNames(): string[] {
    return this._localeData.dates;
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (style == 'long') {
      return this._localeData.longDaysOfWeek;
    }
    if (style == 'short') {
      return this._localeData.shortDaysOfWeek;
    }
    return this._localeData.narrowDaysOfWeek;
  }

  getYearName(date: Moment): string {
    return this.clone(date).utc(true).format('YYYY');
  }

  getFirstDayOfWeek(): number {
    return this._localeData.firstDayOfWeek;
  }

  getNumDaysInMonth(date: Moment): number {
    return this.clone(date).utc(true).daysInMonth();
  }

  clone(date: Moment): Moment {
    return date.clone().utc(true).locale(this.locale);
  }

  createDate(year: number, month: number, date: number): Moment {
    // Moment.js will create an invalid date if any of the components are out of bounds, but we
    // explicitly check each case so we can throw more descriptive errors.
    if (month < 0 || month > 11) {
      throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
    }

    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }

    const result = this._createMoment({ year, month, date }).locale(this.locale).utc(true);

    // If the result isn't valid, the date must have been out of bounds for this month.
    if (!result.isValid()) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }

    return result;
  }

  today(): Moment {
    return this._createMoment(new Date()).locale(this.locale).utc(true);
  }

  parse(value: any, parseFormat: string | string[]): Moment | null {
    if (value && typeof value == 'string') {
      return this._createMoment(value, parseFormat, this.locale).utc(true);
    }
    return value ? this._createMoment(value).locale(this.locale).utc(true) : null;
  }

  format(date: Moment, displayFormat: string): string {
    date = this.clone(date).utc(true);
    if (!this.isValid(date)) {
      throw Error('MomentDateAdapter: Cannot format invalid date.');
    }
    return date.format(displayFormat);
  }

  addCalendarYears(date: Moment, years: number): Moment {
    return this.clone(date).utc(true).add({ years });
  }

  addCalendarMonths(date: Moment, months: number): Moment {
    return this.clone(date).utc(true).add({ months });
  }

  addCalendarDays(date: Moment, days: number): Moment {
    return this.clone(date).utc(true).add({ days });
  }

  toIso8601(date: Moment): string {
    return this.clone(date).utc(true).format();
  }

  override deserialize(value: any): Moment | null {
    let date;
    if (value instanceof Date) {
      date = this._createMoment(value).utc(true).locale(this.locale);
    } else if (this.isDateInstance(value)) {
      // Note: assumes that cloning also sets the correct locale.
      return this.clone(value).utc(true);
    }
    if (typeof value === 'string') {
      if (!value) {
        return null;
      }
      date = this._createMoment(value, moment.ISO_8601).utc(true).locale(this.locale);
    }
    if (date && this.isValid(date)) {
      return this._createMoment(date).locale(this.locale);
    }
    return super.deserialize(value);
  }

  isDateInstance(obj: any): boolean {
    return moment.isMoment(obj);
  }

  isValid(date: Moment): boolean {
    return this.clone(date).utc(true).isValid();
  }

  invalid(): Moment {
    return moment.invalid();
  }

  /** Creates a Moment instance while respecting the current UTC settings. */
  private _createMoment(
    date: MomentInput,
    format?: MomentFormatSpecification,
    locale?: string,
  ): Moment {
    const { strict, useUtc }: MatMomentDateAdapterOptions = {};

    return useUtc
      ? moment.utc(date, format, locale, strict)
      : moment(date, format, locale, strict);
  }
}