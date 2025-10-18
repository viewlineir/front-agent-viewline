import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterHistoryTransactionsComponent } from './filter-history-transactions.component';

describe('FilterHistoryTransactionsComponent', () => {
  let component: FilterHistoryTransactionsComponent;
  let fixture: ComponentFixture<FilterHistoryTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterHistoryTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterHistoryTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
