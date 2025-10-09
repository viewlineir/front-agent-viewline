import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ClearFormFieldsDirective, ShowIconOnTypingDirective, NumberOnlyDirective } from '../directives';



@NgModule({
  declarations: [],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ClearFormFieldsDirective,
    ShowIconOnTypingDirective,
    NumberOnlyDirective,
  ],
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ClearFormFieldsDirective,
    ShowIconOnTypingDirective,
    NumberOnlyDirective,
  ]
})
export class InputImportsModule { }
