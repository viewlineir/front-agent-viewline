import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '@app/core/config';

@Component({
  selector: 'app-empty-list',
  standalone: true,
  imports: [],
  templateUrl: './empty-list.component.html',
  styleUrl: './empty-list.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class EmptyListComponent {

  constructor(
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
  ){}
}
