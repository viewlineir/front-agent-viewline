import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-published-check-box',
  standalone: true,
  imports: [],
  templateUrl: './published-check-box.component.html',
  styleUrls: ['./published-check-box.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PublishedCheckBoxComponent {

  // Input
  @Input() value: boolean;

}
