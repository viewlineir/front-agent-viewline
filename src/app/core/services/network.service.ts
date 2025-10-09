import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private online: boolean = true;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.online = window.navigator.onLine
    }
  }
  checkInternetConnection(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('online', () => {
        this.online = true;
      });

      window.addEventListener('offline', () => {
        this.online = false;
      });
    }
  }

  isOnline(): boolean {
    return this.online;
  }
}
