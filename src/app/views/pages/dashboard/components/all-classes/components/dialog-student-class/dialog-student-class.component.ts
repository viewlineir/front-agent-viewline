import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudentsClassEditComponent } from '../students-class-edit/students-class-edit.component';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-dialog-student-class',
  standalone: true,
  imports: [
    StudentsClassEditComponent
  ],
  templateUrl: './dialog-student-class.component.html',
  styleUrl: './dialog-student-class.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DialogStudentClassComponent implements OnInit {

  @Input() titleClass: string;

  // models
  item: any;

  // string
  title: string;

  // number 
  idClass: number;

  constructor(
    public dialogRef: MatDialogRef<DialogStudentClassComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {
    this.idClass = data.classId;
    this.checkChangeRouter();
  }
  //==================================
  // #region LIFE CYCLE HOOK 
  //==================================
  ngOnInit(): void {
    this.title = `دانش آموزان کلاس ${this.titleClass}`
  }

  //#endregion
  //==================================
  // #region PRIVATE 
  //==================================
  private checkChangeRouter() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.close()
      }
    });
  }
  //#endregion
  //==================================
  // #region PUBLIC 
  //==================================
  close(): void {
    this.dialogRef.close();
  }

  //#endregion
}
