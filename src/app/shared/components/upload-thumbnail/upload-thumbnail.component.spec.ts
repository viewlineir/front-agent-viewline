import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadThumbnailComponent } from './upload-thumbnail.component';

describe('UploadThumbnailComponent', () => {
  let component: UploadThumbnailComponent;
  let fixture: ComponentFixture<UploadThumbnailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadThumbnailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
