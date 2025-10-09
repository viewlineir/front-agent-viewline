import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResizeService implements OnDestroy {
  private resizeSubject: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.handleResize);
    }
  }

  private handleResize = () => {
    this.resizeSubject.next();
  }

  onResize(): Observable<void> {
    return this.resizeSubject.asObservable();
  }

  isCurrentUrl(url: string): boolean {
    return this.router.url === url;
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.handleResize);
      this.resizeSubject.complete();
    }
  }
}
