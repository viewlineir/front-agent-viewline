import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { APP_CONFIG, IAppConfig } from '@app/core/config';
import { AlertService } from '@app/core/services';
import { FileUploadLimitationDetailsComponent } from '@app/shared/components/file-upload-limitaion-details/file-upload-limitation-details.component';
import { ButtonPromiseDirective } from '@app/shared/directives';
import { FileType } from '../../../file-upload-limitaion-details/types/file-enum-type';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-dialog-upload-video',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    ButtonPromiseDirective,
    MatButtonModule,
    FileUploadLimitationDetailsComponent
  ],
  templateUrl: './dialog-upload-video.component.html',
  styleUrl: './dialog-upload-video.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DialogUploadVideoComponent {

  // any
  imageSrc: string | ArrayBuffer | null = null;
  videoSrc: string | ArrayBuffer | null = null;
  // types
  fileType = FileType;

  constructor(
    public dialogRef: MatDialogRef<DialogUploadVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
    private alertService: AlertService,
    private router: Router
  ) {
    this.checkChangeRouter();
  }

  //==================================
  // #region PUBLIC 
  //==================================
  private checkChangeRouter() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.close()
      }
    });
  }

  //#endregion
  //==================================
  // #region PUBLIC 
  //==================================
  onImageChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];

    if (file) {
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        this.alertService.snackBarError('فایل انتخاب شده باید یکی از فرمت های مجاز باشد .');
        return;
      }

      if (file.size > 1 * 1024 * 1024) { // 1 MB
        this.alertService.snackBarError('سایز فایل انتخاب شده نباید بیشتر از 1mb باشد .');
        return;
      }

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onVideoChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];

    if (file) {
      if (file.type !== 'video/mp4') {
        this.alertService.snackBarError('فایل انتخاب شده باید یکی از فرمت های مجاز باشد .');
        return;
      }

      if (file.size > 300 * 1024 * 1024) { // 300 MB
        this.alertService.snackBarError('سایز فایل انتخاب شده نباید بیشتر از 300mb باشد .');
        return;
      }

      this.videoSrc = URL.createObjectURL(file);
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close(true);
  }
  //#endregion
}
