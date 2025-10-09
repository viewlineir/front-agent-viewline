import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPurchasedCoursesComponent } from './dialog-purchased-courses.component';

describe('DialogPurchasedCoursesComponent', () => {
  let component: DialogPurchasedCoursesComponent;
  let fixture: ComponentFixture<DialogPurchasedCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogPurchasedCoursesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPurchasedCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
