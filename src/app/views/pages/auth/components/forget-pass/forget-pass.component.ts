import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-forget-pass',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './forget-pass.component.html',
  styleUrl: './forget-pass.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ForgetPassComponent {

}
