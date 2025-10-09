import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowThumbnailFileComponent } from './show-thumbnail-file.component';

describe('ShowThumbnailFileComponent', () => {
  let component: ShowThumbnailFileComponent;
  let fixture: ComponentFixture<ShowThumbnailFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowThumbnailFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowThumbnailFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
