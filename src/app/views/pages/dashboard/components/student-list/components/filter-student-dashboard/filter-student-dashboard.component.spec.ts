import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterStudentDashboardComponent } from './filter-student-dashboard.component';

describe('FilterStudentDashboardComponent', () => {
  let component: FilterStudentDashboardComponent;
  let fixture: ComponentFixture<FilterStudentDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterStudentDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterStudentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
