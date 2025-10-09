import { Component, Input, ViewEncapsulation } from '@angular/core';
import { AllClassService } from '../../services/all-class.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UtilsService } from '@app/core/services';
import { SettingInfoBaseService } from '@app/views/pages/setting-info-base/services/setting-info-base.service';
import { KeyValuePair } from '@app/core/models/key-value-pair';
import { InputImportsModule } from '@app/shared/modules/input-imports.module';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MousePressDirective } from '@app/shared/directives';
import { ISearchClassModel } from '../../models/search-class.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-filter-all-class',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputImportsModule,
    MatSelectModule,
    MatButtonModule,
    MousePressDirective,
  ],
  templateUrl: './filter-all-class.component.html',
  styleUrl: './filter-all-class.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FilterAllClassComponent {
  // Input
  @Input() loading: any;

  // form
  form: FormGroup;

  // models
  reshteList: KeyValuePair[];
  payeList: KeyValuePair[];
  maghtaList: KeyValuePair[];

  classStatusList: KeyValuePair[] = [
    {
      key: 1,
      value: 'در حال انتظار'
    },
    {
      key: 2,
      value: 'در حال برگزاری'
    },
    {
      key: 3,
      value: 'پایان یافته'
    },
  ]

  // boolean
  resetFilter: boolean = false;
  isPayeLoading: boolean;
  isReshteLoading: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private allClassService: AllClassService,
    private utilsService: UtilsService,
    private settingInfoBaseService: SettingInfoBaseService
  ) {
    this.initForm();
    // info
    // this.getMaghta();
  }
  //==================================
  // #region PRIVATE 
  //==================================
  private getReshteSelect(payeId: number): void {
    this.isReshteLoading = true;
    this.settingInfoBaseService.getReshteSelectWithPaye(payeId)
      .pipe(
        finalize(() => this.isReshteLoading = false)
      )
      .subscribe(
        res => {
          this.reshteList = res;
          this.form.get('reshteId')?.enable();
        }
      )
  }

  private getPaye(maghtaId: number): void {
    this.isPayeLoading = true;
    this.settingInfoBaseService.getPayeSelectWithMaghta(maghtaId)
      .pipe(
        finalize(() => this.isPayeLoading = false)
      )
      .subscribe(
        res => {
          this.payeList = res;
          this.form.get('payeId')?.enable();
        }
      );
  }

  private getMaghta(): void {
    this.settingInfoBaseService.getMaghtaSelect().subscribe(
      res => {
        this.maghtaList = res;
      }
    )
  }
  //#endregion
  //==================================
  // #region PUBLIC 
  //==================================
  loadFilters(): void {
    this.resetFilter = false;
    this.allClassService.updateFilter(this.utilsService.MakeFiltersForTable<ISearchClassModel>(this.f));
  }

  ResetFilters(): void {
    this.resetFilter = true;
    this.form.reset();
    this.form.markAllAsTouched();
    this.allClassService.updateFilter(this.utilsService.MakeFiltersForTable<ISearchClassModel>(this.f));
  }

  //#endregion
  //==================================
  // #region FORM 
  //==================================
  private initForm(): void {
    this.form = this.formBuilder.group({
      maghtaId: [''],
      payeId: [{ value: null, disabled: true }],
      reshteId: [{ value: null, disabled: true }],
      classStatus: [''],
    });

    this.form.get('classStatus')?.valueChanges.subscribe(val => {
      if (val !== '' && val !== null) {
        this.loadFilters();
      }
    });

    // this.form.get('maghtaId')?.valueChanges.subscribe(val => {
    //   if (val !== null) {
    //     this.getPaye(val);
    //   }
    // });

    // this.form.get('payeId')?.valueChanges.subscribe(val => {
    //   if (val !== null) {
    //     this.getReshteSelect(val);
    //   }
    // });
  }

  get f(): any {
    return this.form.controls;
  }
  //#endregion
}
