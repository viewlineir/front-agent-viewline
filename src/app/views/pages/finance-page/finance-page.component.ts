import { Component, ViewEncapsulation } from '@angular/core';
import { CardCountComponent } from '../dashboard/components/card-count/card-count.component';
import { ActivatedRoute } from '@angular/router';
import { IDashboardApiDataModel } from '../dashboard/models/dashboard-api-data.model';
import { HistoryTransactionsComponent } from './components/history-transactions/history-transactions.component';

@Component({
  selector: 'app-finance-page',
  standalone: true,
  imports: [
    CardCountComponent,
    HistoryTransactionsComponent
  ],
  templateUrl: './finance-page.component.html',
  styleUrl: './finance-page.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FinancePageComponent {

  // models
  dataDashboard: IDashboardApiDataModel;

  constructor(
    private route: ActivatedRoute
  ) {
    this.initData();
  }

  //==================================
  // #region PRIVATE 
  //==================================
  private initData(): void {
    this.dataDashboard = this.route.snapshot.data['data'];
  }

  //#endregion

}
