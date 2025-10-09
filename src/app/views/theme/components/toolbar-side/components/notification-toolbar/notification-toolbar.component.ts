import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-notification-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './notification-toolbar.component.html',
  styleUrl: './notification-toolbar.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class NotificationToolbarComponent {

  // boolean
  showNotifList: boolean = false;


  constructor(
    private router: Router
  ) {
    this.checkRouter();
  }

  //==================================
  // #region PUBLIC 
  //==================================
  actionToggle(): void {
    this.showNotifList = !this.showNotifList;
  }
  //#endregion
  //==================================
  // #region PRIVATE 
  //==================================
  private checkRouter(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNotifList = false;
      }
    });
  }
  //#endregion
}
