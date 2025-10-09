import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterAllClassComponent } from './filter-all-class.component';

describe('FilterAllClassComponent', () => {
  let component: FilterAllClassComponent;
  let fixture: ComponentFixture<FilterAllClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterAllClassComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterAllClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
