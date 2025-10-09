import { MaterialPersianDateAdapter, PERSIAN_DATE_FORMATS } from './material.persian-date.adapter';

export function createDateProvider() {
	// const lang = localStorage.getItem('language');

	return new MaterialPersianDateAdapter();

}

export function getDateFormat() {
	// const lang = localStorage.getItem('language');

	return PERSIAN_DATE_FORMATS;

}