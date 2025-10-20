import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { EmptyListComponent } from '@app/shared/components/empty-list/empty-list.component';
import { IOrderItemModel } from '@app/views/pages/dashboard/models/order-item.model';
import { EOrderStatusType } from '@app/views/pages/dashboard/types/order-status.type';

@Component({
  selector: 'app-dialog-purchased-courses',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    CommonModule,
    EmptyListComponent
  ],
  templateUrl: './dialog-purchased-courses.component.html',
  styleUrl: './dialog-purchased-courses.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DialogPurchasedCoursesComponent {

  // Input
  @Input() dataDialog: IOrderItemModel;


  // models
  displayedColumns: string[] = ['row', 'courses', 'teacherName', 'coursePrice', 'discountAmount'];

  // number


  // boolean


  // types
  orderStatusType = EOrderStatusType;

  constructor(
    public dialogRef: MatDialogRef<DialogPurchasedCoursesComponent>
  ) {

  }

  //==================================
  // #region LIFE CYCLE HOOK 
  //==================================


  //#endregion
  //==================================
  // #region PRIVATE 
  //==================================


  //#endregion
  //==================================
  // #region PUBLIC 
  //==================================
  close(): void {
    this.dialogRef.close();
  }

  print(): void {
    window.print();
  }
  //#endregion
}
