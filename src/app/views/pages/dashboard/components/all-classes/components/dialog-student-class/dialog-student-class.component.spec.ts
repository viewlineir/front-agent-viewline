import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogStudentClassComponent } from './dialog-student-class.component';

describe('DialogStudentClassComponent', () => {
  let component: DialogStudentClassComponent;
  let fixture: ComponentFixture<DialogStudentClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogStudentClassComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogStudentClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
