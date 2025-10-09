import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-toolbar-title',
  standalone: true,
  imports: [],
  templateUrl: './toolbar-title.component.html',
  styleUrl: './toolbar-title.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ToolbarTitleComponent {
  
  // Input
  @Input({required: true}) title: string;

}
