import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsClassEditComponent } from './students-class-edit.component';

describe('StudentsClassEditComponent', () => {
  let component: StudentsClassEditComponent;
  let fixture: ComponentFixture<StudentsClassEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsClassEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentsClassEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
