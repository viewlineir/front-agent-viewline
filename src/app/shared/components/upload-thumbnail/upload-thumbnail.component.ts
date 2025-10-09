import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
import { Subscription } from 'rxjs';
import { AlertBoxType } from '../alert-box/types/alert-box-types';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { FileUploadLimitationDetailsComponent } from '../file-upload-limitaion-details/file-upload-limitation-details.component';
import { ButtonPromiseDirective } from '../../directives';
import { APP_CONFIG, IAppConfig } from 'src/app/core/config';
import { UtilsService } from 'src/app/core/services';
import { DomSanitizer } from '@angular/platform-browser';
import { FileType } from '../file-upload-limitaion-details/types/file-enum-type';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-upload-thumbnail',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    ButtonPromiseDirective,
    MatButtonModule,
    ImageCropperModule,
    FileUploadLimitationDetailsComponent,
    AlertBoxComponent
  ],
  templateUrl: './upload-thumbnail.component.html',
  styleUrl: './upload-thumbnail.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class UploadThumbnailComponent implements OnInit {
  // Subjec Or Subscription
  submitSubscription: Subscription;
  stepperHorizental = true;

  // upload
  filesToUpload: File[];
  queueProgress?: number | null;
  cardSrc: any;

  // data
  imageChangedEvent: any = '';
  croppedImage: any = '';

  // string
  allowedExt: string;
  inlineAlertTexts: string[] = [];

  // boolean
  showPreview: boolean;
  isSubmitLoading: boolean;

  // types
  inlineAlertType = AlertBoxType;
  fileType = FileType;

  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    public dialogRef: MatDialogRef<UploadThumbnailComponent>,
    private utilsService: UtilsService,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.checkChangeRouter();
  }

  //==================================
  // #region LIFE CYCLE HOOK
  //==================================

  ngOnInit(): void {
    this.allowedExt = this.utilsService.getAllowExtentions(this.appConfig.allowImageExtentions);
  }
  //#endregion

  //==================================
  // #region PUBLIC 
  //==================================
  onSubmit(): void {
    if (!this.showPreview) {
      return;
    }
    let dataImage = {
      formData: this.filesToUpload[0],
      imageShow: this.croppedImage
    }
    this.dialogRef.close(dataImage)
  }
  selectFile(fileInput: any): void {
    const file = fileInput.target.files[0];
    this.inlineAlertTexts = [];
    if (this.utilsService.isFileValid(file, this.allowedExt, this.appConfig.fileUploadSize)) {
      this.filesToUpload = [];
      this.filesToUpload[0] = file;
      this.previewOfCard();
      fileInput.target['value'] = '';
    } else {
      this.inlineAlertTexts = this.utilsService.makeInlineAlertTextsForFileValidation(file, this.allowedExt, this.appConfig.fileUploadSize);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
  removeImage(): void {
    this.showPreview = false;
    this.cardSrc = null;
    this.croppedImage = null;
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.filesToUpload = [];
    const imageFile = new File([event.blob], 'picop.png', { type: 'image/png' });
    this.filesToUpload.push(imageFile);
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
  }

  // imageCropped(event: ImageCroppedEvent) {
  //   console.log(event)
  //   if (event.base64 !== null && event.base64 !== undefined) {
  //     this.filesToUpload = [];
  //     this.croppedImage = event.base64;
  //     const block = event.base64.split(';');
  //     const realData = block[1].split(',')[1];
  //     const blob = this.dataURItoBlob(realData);
  //     const imageFile = new File([blob], 'serviceOp.png', { type: 'image/png' });
  //     this.filesToUpload.push(imageFile);
  //   } else {
  //     this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
  //   }
  // }

  dataURItoBlob(dataURI: any): Blob {
    let byteString;
    if (isPlatformBrowser(this.platformId)) {
      byteString = window.atob(dataURI);
    }
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }


  imageLoaded(): void {
    // console.log('Image loaded');
  }

  cropperReady(): void {
    //  console.log('Cropper ready');
  }

  loadImageFailed(): void {
    // console.log('Load failed');
  }

  //#endregion
  //==================================
  // #region PRIVATE 
  //==================================

  private previewOfCard(): void {
    const reader = new FileReader();
    reader.readAsDataURL(this.filesToUpload[0]);
    reader.onload = (_event) => {
      this.cardSrc = reader.result;
    };
    this.showPreview = true;
  }

  private checkChangeRouter() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.close()
      }
    });
  }
  //#endregion

}
