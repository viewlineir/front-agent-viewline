import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { CardCountComponent } from './components/card-count/card-count.component';
import { AgentCodeComponent } from './components/agent-code/agent-code.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { IDashboardApiDataModel } from './models/dashboard-api-data.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    CardCountComponent,
    AgentCodeComponent,
    StudentListComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {
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
