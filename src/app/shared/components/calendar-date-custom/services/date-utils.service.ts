import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {
  getDaysBeforeAndAfter(date: Date, range: number = 6, weekStartDay: string = 'Saturday'): { before: Date[], after: Date[] } {
    const daysBefore: Date[] = [];
    const daysAfter: Date[] = [];

    const weekStart = this.getWeekStartDayIndex(weekStartDay);

    // Calculate days before
    for (let i = 1; i <= range; i++) {
      const beforeDate = new Date(date.getTime());
      beforeDate.setDate(date.getDate() - i);
      daysBefore.unshift(beforeDate);
    }

    // Calculate days after
    for (let i = 1; i <= range; i++) {
      const afterDate = new Date(date.getTime());
      afterDate.setDate(date.getDate() + i);
      daysAfter.push(afterDate);
    }

    // Ensure week starts on the correct day
    while (daysBefore.length && daysBefore[0].getDay() !== weekStart) {
      daysBefore.shift();
    }
    while (daysAfter.length && daysAfter[daysAfter.length - 1].getDay() !== (weekStart + 6) % 7) {
      daysAfter.pop();
    }

    return { before: daysBefore, after: daysAfter };
  }

  private getWeekStartDayIndex(day: string): number {
    switch (day.toLowerCase()) {
      case 'sunday': return 0;
      case 'monday': return 1;
      case 'tuesday': return 2;
      case 'wednesday': return 3;
      case 'thursday': return 4;
      case 'friday': return 5;
      case 'saturday': return 6;
      default: return 6;
    }
  }
}
