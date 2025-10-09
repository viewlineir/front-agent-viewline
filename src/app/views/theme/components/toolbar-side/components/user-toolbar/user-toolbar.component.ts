import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/auth/services';
import { APP_CONFIG, IAppConfig } from '@app/core/config';
import { BrowserStorageService } from '@app/core/services';
import { UserInfoService } from '@app/core/services/userInfo.service';

@Component({
  selector: 'app-user-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './user-toolbar.component.html',
  styleUrl: './user-toolbar.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class UserToolbarComponent {


  // string
  displayName: string;

  // boolean
  showList: boolean = false;

  constructor(
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
    private router: Router,
    private authService: AuthService,
    private matIconRegistry: MatIconRegistry,
    private _sanitizer: DomSanitizer,
    private userInfoService: UserInfoService,
    private browserStorageService: BrowserStorageService,
  ) {
    this.handleIconSvg();
    this.checkRouter();
    this.userInformation();
  }

  //==================================
  // #region PUBLIC 
  //==================================
  logout(): void {
    this.authService.logout();
  }

  actionToggle(): void {
    this.showList = !this.showList;
  }
  //#endregion
  //==================================
  // #region PRIVATE 
  //==================================
  private checkRouter(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showList = false;
      }
    });
  }

  private handleIconSvg(): void {
    this.matIconRegistry.addSvgIcon(
      'notification',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon/notification.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'dashboard_plus',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon/dashboard-plus.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'logout',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon/logout.svg')
    );
  }

  private userInformation(): void {
    this.userInfoService.resultUserInfo$.subscribe(
      res => {
        if (Object.keys(res).length > 0) {
          this.displayName = res.displayName;
        } else {
          let userInfoAccount = this.browserStorageService.getLocal('userInfoAccount');
          this.displayName = userInfoAccount.displayName;
        }
      }
    );
  }
  //#endregion

}
