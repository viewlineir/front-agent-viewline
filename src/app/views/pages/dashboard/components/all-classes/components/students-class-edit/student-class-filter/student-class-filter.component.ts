import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormControl, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MousePressDirective } from '@app/shared/directives';
import { InputImportsModule } from '@app/shared/modules/input-imports.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { UtilsService } from '@app/core/services';
import { IFilterStudentClassModel } from '../models/filter-student-model';
import { StudentClassPopupService } from '../services/student-class-popup.service';


@Component({
  selector: 'app-student-class-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputImportsModule,
    MatButtonModule,
    MousePressDirective,
    MatCheckboxModule,
    MatRadioModule
  ],
  templateUrl: './student-class-filter.component.html',
  styleUrl: './student-class-filter.component.scss'
})
export class StudentClassFilterComponent {

  // Input
  @Input() loading: any;

  // form
  form: FormGroup;

  // array
  registerTypes = [
    "مهمان",
    "حضوری",
    "آنلاین",
    "انتقالی",
  ];

  // boolean
  resetFilter: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private studentClassPopupService: StudentClassPopupService,
  ) {
    this.initForm();
  }
  //==================================
  // #region PRIVATE 
  //==================================
  private initForm(): void {
    this.form = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      mobile: [''],
      classId: [''],
      registerType: [''],
      registerDate_Start: [''],
      registerDate_End: [''],
    });
  }

  get f(): any {
    return this.form.controls;
  }
  //#endregion
  //==================================
  // #region PUBLIC 
  //==================================
  loadFilters(): void {
    this.resetFilter = false;
    this.studentClassPopupService.updateFilter(this.utilsService.MakeFiltersForTable<IFilterStudentClassModel>(this.f));
  }

  ResetFilters(): void {
    this.resetFilter = true;
    this.form.reset();
    this.form.markAllAsTouched();
    this.studentClassPopupService.updateFilter(this.utilsService.MakeFiltersForTable<IFilterStudentClassModel>(this.f));
  }



  changeValueItemFormType(type: string, event: any, i: number): void {
    const types: FormArray = this.form.get(type) as FormArray;
    // if (type !== 'Rate') {
    if (event.checked) {
      types.push(new FormControl(i));
    } else {
      const index = types.controls.findIndex(types => types.value === i);
      types.removeAt(index);
    }
  }
  //#endregion
}
