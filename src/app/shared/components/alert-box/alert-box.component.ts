import { Component, Input, ViewEncapsulation } from '@angular/core';
import { AlertBoxType } from './types/alert-box-types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-box.component.html',
  styleUrls: ['./alert-box.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AlertBoxComponent {
  // Input
  @Input() haveHeader: boolean;
  @Input() type: AlertBoxType;
  @Input() title: string;
  @Input() text: any;

  //string
  iconName: string;
  calssName: string;
  // types
  alertBoxType = AlertBoxType;

  constructor() { }

}
