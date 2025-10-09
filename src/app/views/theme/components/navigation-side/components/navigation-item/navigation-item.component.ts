import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { INavigationItem } from '../../models/navigation-item.model';
import { ENavigationType } from '../../types/navigation.type';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-navigation-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './navigation-item.component.html',
  styleUrl: './navigation-item.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class NavigationItemComponent {
  // Input
  @Input({ required: true }) item: INavigationItem;
  @Input({ required: true }) level: number;

  // boolean
  isOpen: boolean = false;

  // types
  navigationType = ENavigationType;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private _sanitizer: DomSanitizer,
  ) {
    this.handleIconSvg();
  }


  toggleDropDown(): void {
    this.isOpen = !this.isOpen;
  }

  private handleIconSvg(): void {
    this.matIconRegistry.addSvgIcon(
      'package',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/package.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'folder',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/folder.svg')
    );
  }

}
