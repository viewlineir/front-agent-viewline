import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IBreadcrumbModel } from './model/breadcrumb.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule
  ],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BreadcrumbComponent {
  // Input
  @Input({ required: true }) breadCrumbList: IBreadcrumbModel[];
  @Input() backUrl: string;
}
