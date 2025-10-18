import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDiscontCodeListComponent } from './dialog-discont-code-list.component';

describe('DialogDiscontCodeListComponent', () => {
  let component: DialogDiscontCodeListComponent;
  let fixture: ComponentFixture<DialogDiscontCodeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDiscontCodeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDiscontCodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
