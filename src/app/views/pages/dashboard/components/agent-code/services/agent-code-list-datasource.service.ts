import { computed, Injectable, OnDestroy, signal } from '@angular/core';
import { AgentCodeService } from './agent-code.service';
import { DynamicSearch } from '@app/core/models/dynamic-search';
import { finalize, Subscription } from 'rxjs';
import { IListDiscountRecordsModel } from '../../../models/list-discount.model';
import { IFilterDiscountCodeListModel } from '../models/filter-discount-code-list.model';

@Injectable({
  providedIn: 'root'
})
export class AgentCodeListDatasourceService implements OnDestroy {

  // Subscription
  loadSubscription: Subscription;

  private dataSource = signal<IListDiscountRecordsModel[]>([]);
  public dataSource$ = computed(() => { return this.dataSource() });

  private LengthSource = signal<number>(0);
  public length$ = computed(() => { return this.LengthSource() });


  private loadingSubject = signal<boolean>(false);
  public loading$ = computed(() => { return this.loadingSubject() });

  private searchParam: DynamicSearch<IFilterDiscountCodeListModel>;

  constructor(
    private agentCodeService: AgentCodeService
  ) {
    this.searchParam = {
      search: true,
      orderBy: 'Id',
      orderType: 'desc',
      page: 1,
      pageSize: 10
    };
  }
  ngOnDestroy(): void {
    if (this.loadSubscription) {
      this.loadSubscription.unsubscribe();
    }
  }

  updateDataSource(value: any): void {
    this.dataSource.set(value);
  }

  load(
    pageNumber: number,
    pageSize: number,
    filters: IFilterDiscountCodeListModel
  ): void {
    this.loadingSubject.set(true);
    // add filters
    this.searchParam.filters = filters;

    // paging
    this.searchParam.page = pageNumber;
    this.searchParam.pageSize = pageSize;

    this.loadSubscription = this.agentCodeService.getListDiscount(this.searchParam)
      .pipe(
        finalize(() => this.loadingSubject.set(false))
      )
      .subscribe((res: any) => {
        this.LengthSource.set(res.totalCount);
        this.dataSource.set(res.records);
      });
  }
}
