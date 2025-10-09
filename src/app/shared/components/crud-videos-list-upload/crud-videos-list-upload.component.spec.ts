import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudVideosListUploadComponent } from './crud-videos-list-upload.component';

describe('CrudVideosListUploadComponent', () => {
  let component: CrudVideosListUploadComponent;
  let fixture: ComponentFixture<CrudVideosListUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudVideosListUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudVideosListUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
