import { ThemeService } from './../../services/theme.service';
import { Component, ViewEncapsulation } from '@angular/core';
import { AcademicYearComponent } from './components/academic-year/academic-year.component';
import { ToolbarTitleComponent } from './components/toolbar-title/toolbar-title.component';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserStorageService, GenericServiceService } from '@app/core/services';
import { UserInfoService } from '@app/core/services/userInfo.service';
import { UserInfo } from '@app/core/models/user-info';
import { AuthService } from '@app/core/auth/services';
import { MatIconModule } from '@angular/material/icon';
import { NotificationToolbarComponent } from './components/notification-toolbar/notification-toolbar.component';
import { UserToolbarComponent } from './components/user-toolbar/user-toolbar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-toolbar-side',
  standalone: true,
  imports: [
    AcademicYearComponent,
    ToolbarTitleComponent,
    MatMenuModule,
    MatIconModule,
    NotificationToolbarComponent,
    UserToolbarComponent,
    RouterLink
  ],
  templateUrl: './toolbar-side.component.html',
  styleUrl: './toolbar-side.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ToolbarSideComponent {

  // models
  userInfo: UserInfo;

  // string
  titleText: string;

  // boolean
  navigationAction = false;

  constructor(
    private themeService: ThemeService,
    private genericServiceService: GenericServiceService,
    private userInfoService: UserInfoService,
    private authService: AuthService,
    private browserStorageService: BrowserStorageService,
  ) {
    this.getActionNavigation();
    this.getUserInfo();
    this.getTitle();
  }

  //==================================
  // #region PRIVATE 
  //==================================
  private getTitle(): void {
    this.genericServiceService.titlePageToolbar$.subscribe(
      res => {
        this.titleText = res;
      }
    )
  }

  private getActionNavigation(): void {
    this.themeService.navigationAction$.subscribe(
      res => {
        this.navigationAction = res;
      }
    );
  }

  private getUserInfo(): void {
    this.userInfoService.resultUserInfo$.subscribe(
      res => {
        if (Object.keys(res).length > 0) {
          this.userInfo = res;
        } else {
          let userInfoAccount = this.browserStorageService.getLocal('userInfoAccount');
          if (userInfoAccount === null) {
            this.authService.getUserInformation();
          } else {
            this.userInfo = userInfoAccount;
          }
        }
      }
    )
  }

  //#endregion
  //==================================
  // #region PUBLIC 
  //==================================
  actionNavigation(): void {
    this.navigationAction = !this.navigationAction;
    this.themeService.updateNavigationAction(this.navigationAction);
  }

  //#endregion
}
