import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentCodeComponent } from './agent-code.component';

describe('AgentCodeComponent', () => {
  let component: AgentCodeComponent;
  let fixture: ComponentFixture<AgentCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
