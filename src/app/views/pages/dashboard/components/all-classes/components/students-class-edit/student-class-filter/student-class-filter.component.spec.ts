import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentClassFilterComponent } from './student-class-filter.component';

describe('StudentClassFilterComponent', () => {
  let component: StudentClassFilterComponent;
  let fixture: ComponentFixture<StudentClassFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentClassFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentClassFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
