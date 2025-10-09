import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SkeletonLoaderComponent {
  // Input
  @Input({ required: true }) type: 'card' | 'link' | 'circle';
  @Input() width: string;
  @Input() height: string;
}
