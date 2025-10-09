import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalComponent } from './sal.component';

describe('SalComponent', () => {
  let component: SalComponent;
  let fixture: ComponentFixture<SalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
