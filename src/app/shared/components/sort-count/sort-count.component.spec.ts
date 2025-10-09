import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortCountComponent } from './sort-count.component';

describe('SortCountComponent', () => {
  let component: SortCountComponent;
  let fixture: ComponentFixture<SortCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortCountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SortCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
