import { DatePipe } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { UtilsService } from '@app/core/services';
import { DatepickerImportsModule } from '@app/shared/modules/datepicker-imports.module';
import { InputImportsModule } from '@app/shared/modules/input-imports.module';
import { HistoryTransactionsService } from '../../services/history-transactions.service';
import { IFilterHistoryTransactionsListModel } from '../../models/filter-history-transactions-list.model';

@Component({
  selector: 'app-filter-history-transactions',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputImportsModule,
    MatSelectModule,
    DatepickerImportsModule,
  ],
  templateUrl: './filter-history-transactions.component.html',
  styleUrl: './filter-history-transactions.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
})
export class FilterHistoryTransactionsComponent {

  // Input
  @Input() loading: boolean;

  // form
  form: FormGroup;

  // models


  // boolean
  resetFilter: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private historyTransactionsService: HistoryTransactionsService,
    private utilsService: UtilsService,
  ) {
    this.initForm();
  }
  //==================================
  // #region PRIVATE 
  //==================================

  private buildFilterForm(): FormGroup {
    const value = this.form.value;

    return this.formBuilder.group({
      userPayoutDate_From: [
        value['userPayoutDate_From']
          ? this.utilsService.changeFormatDate(value['orderCreatedDate_From'], '00:00:00')
          : null
      ],
      userPayoutDate_To: [
        value['userPayoutDate_To']
          ? this.utilsService.changeFormatDate(value['userPayoutDate_To'], '23:59:59')
          : null
      ],
    });
  }


  //#endregion
  //==================================
  // #region PUBLIC 
  //==================================
  loadFilters(): void {
    this.resetFilter = false;
    let newForm = this.buildFilterForm();
    this.historyTransactionsService.updateFilter(this.utilsService.MakeFiltersForTable<IFilterHistoryTransactionsListModel>(newForm.controls));
  }

  resetField(fieldName: keyof IFilterHistoryTransactionsListModel | string): void {
    const ctrl = this.form.get(fieldName);
    if (!ctrl) return;

    const isDate = fieldName === 'userPayoutDate_From' || fieldName === 'userPayoutDate_To';

    ctrl.reset(isDate ? null : '', { emitEvent: false });

    const newForm = this.buildFilterForm();
    this.historyTransactionsService.updateFilter(
      this.utilsService.MakeFiltersForTable<IFilterHistoryTransactionsListModel>(newForm.controls)
    );
  }

  ResetFilters(): void {
    this.resetFilter = true;
    this.form.reset();
    this.form.markAllAsTouched();
    this.historyTransactionsService.updateFilter(this.utilsService.MakeFiltersForTable<IFilterHistoryTransactionsListModel>(this.f));
  }

  //#endregion
  //==================================
  // #region FORM 
  //==================================
  private initForm(): void {
    this.form = this.formBuilder.group({
      userPayoutDate_From: [''],
      userPayoutDate_To: [''],
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
