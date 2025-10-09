import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { APP_CONFIG, IAppConfig } from '@app/core/config';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AuthComponent {

  constructor(
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
  ){}

}
