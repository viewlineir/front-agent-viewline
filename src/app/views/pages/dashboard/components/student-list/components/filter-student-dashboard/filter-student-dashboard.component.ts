import { DatePipe } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { KeyValuePair } from '@app/core/models/key-value-pair';
import { UtilsService } from '@app/core/services';
import { MousePressDirective } from '@app/shared/directives';
import { DatepickerImportsModule } from '@app/shared/modules/datepicker-imports.module';
import { InputImportsModule } from '@app/shared/modules/input-imports.module';
import { IFilterStudentModel } from '@app/views/pages/dashboard/models/filter-student.model';
import { IListDiscountModel } from '@app/views/pages/dashboard/models/list-discount.model';
import { DashboardService } from '@app/views/pages/dashboard/services/dashboard.service';
import { EOrderStatusType } from '@app/views/pages/dashboard/types/order-status.type';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-filter-student-dashboard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputImportsModule,
    MatSelectModule,
    MatButtonModule,
    MousePressDirective,
    DatepickerImportsModule,
  ],
  templateUrl: './filter-student-dashboard.component.html',
  styleUrl: './filter-student-dashboard.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
})
export class FilterStudentDashboardComponent {

  // Input
  @Input() loading: boolean;

  // form
  form: FormGroup;

  // models
  orderStatusList: KeyValuePair[] = [
    {
      key: EOrderStatusType.Pending,
      value: 'در انتظار پرداخت'
    },
    {
      key: EOrderStatusType.Paid,
      value: 'پرداخت شده'
    },
    {
      key: EOrderStatusType.Faild,
      value: 'لغو پرداخت'
    },
    {
      key: EOrderStatusType.InstallmentsWithInitialPayment,
      value: 'اقساطی با پرداخت اولیه'
    },
    {
      key: EOrderStatusType.Canceled,
      value: 'کنسل شده'
    },
  ];

  discountData: IListDiscountModel;

  // boolean
  resetFilter: boolean = false;
  loadingDiscount: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private dashboardService: DashboardService,
    private utilsService: UtilsService,
  ) {
    this.initForm();
    this.getListDiscount();
  }
  //==================================
  // #region PRIVATE 
  //==================================

  private buildFilterForm(): FormGroup {
    const value = this.form.value;

    return this.formBuilder.group({
      discountId: [value['discountId']],
      orderStatus: [value['orderStatus']],
      identifierName: [value['identifierName']],
      orderCreatedDate_From: [
        value['orderCreatedDate_From']
          ? this.utilsService.changeFormatDate(value['orderCreatedDate_From'], '00:00:00')
          : null
      ],
      orderCreatedDate_To: [
        value['orderCreatedDate_To']
          ? this.utilsService.changeFormatDate(value['orderCreatedDate_To'], '23:59:59')
          : null
      ],
    });
  }

  private getListDiscount(): void {
    this.loadingDiscount = true;
    this.dashboardService.getListDiscount().pipe(
      finalize(() => this.loadingDiscount = false)
    ).subscribe(
      res => {
        this.discountData = res;
      }
    )
  }

  //#endregion
  //==================================
  // #region PUBLIC 
  //==================================
  loadFilters(): void {
    this.resetFilter = false;
    let newForm = this.buildFilterForm();
    this.dashboardService.updateFilter(this.utilsService.MakeFiltersForTable<IFilterStudentModel>(newForm.controls));
  }

  resetField(fieldName: keyof IFilterStudentModel | string): void {
    const ctrl = this.form.get(fieldName);
    if (!ctrl) return;

    const isDate = fieldName === 'orderCreatedDate_From' || fieldName === 'orderCreatedDate_To';

    ctrl.reset(isDate ? null : '', { emitEvent: false });

    const newForm = this.buildFilterForm();
    this.dashboardService.updateFilter(
      this.utilsService.MakeFiltersForTable<IFilterStudentModel>(newForm.controls)
    );
  }

  ResetFilters(): void {
    this.resetFilter = true;
    this.form.reset();
    this.form.markAllAsTouched();
    this.dashboardService.updateFilter(this.utilsService.MakeFiltersForTable<IFilterStudentModel>(this.f));
  }

  //#endregion
  //==================================
  // #region FORM 
  //==================================
  private initForm(): void {
    this.form = this.formBuilder.group({
      discountId: [''],
      orderStatus: [''],
      identifierName: [''],
      orderCreatedDate_From: [''],
      orderCreatedDate_To: [''],
    });

    this.form.valueChanges.subscribe(val => {
      if (val !== '' && val !== null) {
        this.loadFilters();
      }
    });
  }

  get f(): any {
    return this.form.controls;
  }
  //#endregion
}