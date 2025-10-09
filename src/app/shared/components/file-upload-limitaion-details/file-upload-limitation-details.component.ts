import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_CONFIG, IAppConfig } from '../../../core/config';
import { UtilsService } from '../../../core/services';
import { FileType } from './types/file-enum-type';

@Component({
  selector: 'app-file-upload-limitation-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload-limitation-details.component.html',
  styleUrls: ['./file-upload-limitation-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FileUploadLimitationDetailsComponent implements OnInit {

  @Input() fileType: FileType;

  // string
  allowedExt: string;

  // number
  fileMaxSize: number;
  constructor(
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private utilsService: UtilsService
  ) { }

  //==================================
  // #region LIFE CYCLE HOOK 
  //==================================
  ngOnInit(): void {
    let allowExtention = this.appConfig.allowImageExtentions;
    if (this.fileType === FileType.Video) {
      allowExtention = this.appConfig.allowViedoExtentions;
    }
    this.allowedExt = this.utilsService.getAllowExtentions(allowExtention).replace('.', '');
    this.setMaxSize();
  }
  //#endregion
  //==================================
  // #region PRIVATE
  //==================================
  private setMaxSize(): void {
    let mbMaxSize = (this.appConfig.fileUploadSize / 1048578);
    if (this.fileType === FileType.Video) {
      mbMaxSize = (this.appConfig.videoUploadSize / 1048578);
    }
    if ((mbMaxSize % 1) !== 0) {
      mbMaxSize = parseFloat(mbMaxSize.toFixed(2));
    }
    this.fileMaxSize = mbMaxSize;
  }
  //#endregion

}
