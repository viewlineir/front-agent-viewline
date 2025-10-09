import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SalService } from '@app/views/pages/sal/services/sal.service';
import { SalStateService } from '@app/views/pages/sal/state/sal-state.service';
import { ISalSelectModel } from '@app/views/pages/sal/models/sal-select.model';
import { BrowserStorageService } from '@app/core/services';

@Component({
  selector: 'app-academic-year',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './academic-year.component.html',
  styleUrl: './academic-year.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AcademicYearComponent {

  // form control
  academicYear = new FormControl(1);

  // models
  listSal: ISalSelectModel[];


  constructor(
    private salService: SalService,
    private salStateService: SalStateService,
    private browserStorageService: BrowserStorageService,
  ) {
    this.initData();
  }


  //==================================
  // #region PRIVATE 
  //==================================
  changeYear(item: ISalSelectModel): void {
    this.browserStorageService.setLocal("salSelected", item);
    window.location.reload();
  }
  //#endregion
  //==================================
  // #region PRIVATE 
  //==================================
  private initData(): void {
    this.salStateService.salSelectListResult$.subscribe(
      res => {
        if (res.length > 0) {
          this.listSal = res;
          let salSelected = this.browserStorageService.getLocal("salSelected");
          if (salSelected !== null) {
            this.academicYear.setValue(salSelected.key);
          } else {
            this.browserStorageService.setLocal("salSelected", res[0]);
            this.academicYear.setValue(res[0].key);
          }
        } else {
          this.getSalSelect();
        }
      }
    )
  }


  private getSalSelect(): void {
    this.salService.getSalSelect().subscribe(
      res => {
        this.salStateService.updateSalSelectResult(res);
        this.listSal = res;
        let salSelected = this.browserStorageService.getLocal("salSelected");
        if (salSelected !== null) {
          this.academicYear.setValue(salSelected.key);
        } else {
          this.browserStorageService.setLocal("salSelected", res[0]);
          this.academicYear.setValue(res[0].key);
        }
      }
    )
  }
  //#endregion

}
