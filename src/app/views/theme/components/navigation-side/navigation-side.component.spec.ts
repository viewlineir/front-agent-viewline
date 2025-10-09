import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationSideComponent } from './navigation-side.component';

describe('NavigationSideComponent', () => {
  let component: NavigationSideComponent;
  let fixture: ComponentFixture<NavigationSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationSideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavigationSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
