import { Component, EventEmitter, Input, Output, ViewEncapsulation, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-sort-count',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './sort-count.component.html',
  styleUrl: './sort-count.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SortCountComponent {

  // Output
  @Output() sortValue = new EventEmitter<number>();

  // Input
  @Input() text: string;
  @Input() hideSort: boolean = false;

  // form control
  sort = new FormControl(1);

  //==================================
  // #region PUBLIC 
  //==================================
  getValueSort(event: any): void {
    this.sortValue.emit(event);
  }

  //#endregion
}
