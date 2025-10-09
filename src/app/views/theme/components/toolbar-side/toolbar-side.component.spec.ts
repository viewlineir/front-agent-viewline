import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarSideComponent } from './toolbar-side.component';

describe('ToolbarSideComponent', () => {
  let component: ToolbarSideComponent;
  let fixture: ComponentFixture<ToolbarSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarSideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToolbarSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
