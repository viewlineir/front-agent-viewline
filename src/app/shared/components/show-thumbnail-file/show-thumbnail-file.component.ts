import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ClassSessionsFileService } from '@app/views/pages/classes/components/edit-class/components/sessions/services/class-sessions-file.service';
import { finalize, Subscription } from 'rxjs';

@Component({
  selector: 'app-show-thumbnail-file',
  standalone: true,
  imports: [],
  templateUrl: './show-thumbnail-file.component.html',
  styleUrl: './show-thumbnail-file.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ShowThumbnailFileComponent implements OnInit {

  @Input({ required: true }) idFile: number;

  loadSubscription: Subscription;

  thumbnailUrl: SafeUrl;

  loadingImage: boolean;

  constructor(
    private classSessionsFileService: ClassSessionsFileService,
    private domSanitizer: DomSanitizer,
  ) { }

  //==================================
  // #region LIFE CYCLE HOOK
  //==================================
  ngOnInit(): void {
    this.getThumbnail();
  }
  //#endregion
  //==================================
  // #region PRIVATE 
  //==================================

  private getThumbnail(): void {
    this.loadingImage = true;
    this.loadSubscription = this.classSessionsFileService.showThumbnail(this.idFile)
      .pipe(
        finalize(() => {
          this.loadingImage = false;
        })
      ).subscribe(
        response => {
          const imageUrl = URL.createObjectURL(response);
          const imageBlob = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
          this.thumbnailUrl = imageBlob;
        }
    );
    // this.thumbnailUrl = this.classSessionsFileService.download(this.idFile, true)
  }

  //#endregion

}
