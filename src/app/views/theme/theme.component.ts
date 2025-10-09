import { Component, ViewEncapsulation } from '@angular/core';
import { ToolbarSideComponent } from './components/toolbar-side/toolbar-side.component';
import { NavigationSideComponent } from './components/navigation-side/navigation-side.component';
import { ThemeService } from './services/theme.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-theme',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarSideComponent,
    NavigationSideComponent,
    RouterOutlet
  ],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ThemeComponent {
  navigationAction = false;

  constructor(
    private themeService: ThemeService
  ) {
    this.actionNavigation();
  }

  //#region ================== PRIVATE
  private actionNavigation(): void {
    this.themeService.navigationAction$.subscribe(
      res => {
        this.navigationAction = res;
      }
    );
  }
  //#endregion
}
