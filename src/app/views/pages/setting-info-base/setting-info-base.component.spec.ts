import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingInfoBaseComponent } from './setting-info-base.component';

describe('SettingInfoBaseComponent', () => {
  let component: SettingInfoBaseComponent;
  let fixture: ComponentFixture<SettingInfoBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingInfoBaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingInfoBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
