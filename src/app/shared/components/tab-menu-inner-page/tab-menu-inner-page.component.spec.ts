import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabMenuInnerPageComponent } from './tab-menu-inner-page.component';

describe('TabMenuInnerPageComponent', () => {
  let component: TabMenuInnerPageComponent;
  let fixture: ComponentFixture<TabMenuInnerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabMenuInnerPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabMenuInnerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
