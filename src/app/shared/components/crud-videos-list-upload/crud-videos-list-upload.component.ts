import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DialogUploadVideoComponent } from './components/dialog-upload-video/dialog-upload-video.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-crud-videos-list-upload',
  standalone: true,
  imports: [
    MatIconModule,
  ],
  templateUrl: './crud-videos-list-upload.component.html',
  styleUrl: './crud-videos-list-upload.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CrudVideosListUploadComponent {

  constructor(
    private dialog: MatDialog,
    @Inject(DOCUMENT) private _document: Document,
  ) { }

  //==================================
  // #region PUBLIC 
  //==================================
  togglePlay(event: any): void {
    const parent = event.target.closest('.item-video');
    const video = parent.querySelectorAll('.video')[0];
    // Pause all other videos
    const allVideos = this._document.querySelectorAll('.video')as NodeListOf<HTMLVideoElement>;
    allVideos.forEach(v => {
        if (v !== video) {
            v.pause();
            v.closest('.item-video').classList.add('paused');
        }
    });
    video.paused ? video.play() : video.pause();
    if (video.paused) {
      parent.classList.add('paused');
    } else {
      parent.classList.remove('paused');
    }
  }

  uploadVideoDialog(): void {
    const dialogRef = this.dialog.open(DialogUploadVideoComponent, {
      disableClose: true,
      width: '600px',
      maxWidth: '100vw',
      height: '400px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
      }
    });
  }

  //#endregion
}
