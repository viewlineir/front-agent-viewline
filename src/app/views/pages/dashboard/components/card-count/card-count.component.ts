import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { IDashboardApiDataModel } from '../../models/dashboard-api-data.model';

@Component({
  selector: 'app-card-count',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule
  ],
  templateUrl: './card-count.component.html',
  styleUrl: './card-count.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CardCountComponent {

  // Input
  @Input() dataDashboard: IDashboardApiDataModel;
  
  constructor(
    private matIconRegistry: MatIconRegistry,
    private _sanitizer: DomSanitizer,
  ) {
    this.handleIconSvg();
  }

  //==================================
  // #region PRIVATE 
  //==================================
  private handleIconSvg(): void {
    this.matIconRegistry.addSvgIcon(
      'people_alt',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon/people-alt.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'doller',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon/doller.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'laptop',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon/laptop.svg')
    );
  }
  //#endregion


}
