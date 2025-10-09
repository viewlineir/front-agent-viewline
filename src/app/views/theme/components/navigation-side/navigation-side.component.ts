import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { NavigationService } from './services/navigation.service';
import { ENavigationType } from './types/navigation.type';
import { NavigationItemComponent } from './components/navigation-item/navigation-item.component';

@Component({
  selector: 'app-navigation-side',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavigationItemComponent
  ],
  templateUrl: './navigation-side.component.html',
  styleUrl: './navigation-side.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class NavigationSideComponent {
  // boolean
  navigationAction = false;

  // types
  navigationType = ENavigationType;

  constructor(
    private themeService: ThemeService,
    public navigationService: NavigationService
  ) {
    this.getActionNavigation();
    this.navigationService.navigationListData();
  }

  //==================================
  // #region PUBLIC 
  //==================================
  actionNavigation(): void {
    this.navigationAction = !this.navigationAction;
    this.themeService.updateNavigationAction(this.navigationAction);
  }
  //#endregion

  //#region ================== PRIVATE
  private getActionNavigation(): void {
    this.themeService.navigationAction$.subscribe(
      res => {
        this.navigationAction = res;
      }
    );
  }
  //#endregion
}
