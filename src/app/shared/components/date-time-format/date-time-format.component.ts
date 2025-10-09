import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateToPersian } from '@app/shared/pipes';

@Component({
  selector: 'app-date-time-format',
  standalone: true,
  imports: [CommonModule, DateToPersian],
  templateUrl: './date-time-format.component.html',
  styleUrls: ['./date-time-format.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DateTimeFormatComponent {
  // Input
  @Input({ required: true }) date: string;
  @Input() isRow: boolean = false;
}
