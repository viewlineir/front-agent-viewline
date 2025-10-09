import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarDateCustomComponent } from './calendar-date-custom.component';

describe('CalendarDateCustomComponent', () => {
  let component: CalendarDateCustomComponent;
  let fixture: ComponentFixture<CalendarDateCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarDateCustomComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarDateCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
