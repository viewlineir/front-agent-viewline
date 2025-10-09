import { Pipe, PipeTransform } from '@angular/core';
import moment from 'jalali-moment';

@Pipe({
    name: 'jalali',
    standalone: true
})
export class DateToPersian implements PipeTransform {
    private language = 'fa';
    constructor() {
    }
    transform(value: any, type = 'date'): any {
        let format = 'jYYYY/jMM/jDD';
        if (type === 'dateTime') {
            format = 'jYYYY/jMM/jDD HH:mm';
        } else if (type === 'time') {
            format = 'HH:mm';
        } else if (type === 'monthName') {
            format = 'dddd، jD jMMMM jYYYY';
        } else if (type === 'dateMonthName') {
            format = 'jD jMMMM jYYYY';
        } else if (type === 'day') {
            format = 'dddd';
        } else if (type === 'dayNumber') {
            format = 'jD';
        }

        // Parse the value as a UTC date and convert to Jalali
        const MomentDate = moment(value).local();
        const jalaliDate = MomentDate.locale(this.language).format(format);

        return jalaliDate;
    }
}
