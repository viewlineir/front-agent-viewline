import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrowserStorageService {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  getSession(key: string): any {
    let data;
    if (isPlatformBrowser(this.platformId)) {
      data = window.sessionStorage.getItem(key);
    }
    /* data !== null ? JSON.parse(data) : {} 
       baraye ine ke ehtemal dare session null bashe, bejash khali gozashtam */
    return data || '';
  }

  setSession(key: string, value: any): void {
    const data = value === undefined ? null : JSON.stringify(value);
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.setItem(key, data || '');
    }
  }

  removeSession(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.removeItem(key);
    }
  }

  removeAllSessions(): void {
    for (const key in window.sessionStorage) {
      if (isPlatformBrowser(this.platformId)) {
        if (window.sessionStorage.hasOwnProperty(key)) {
          this.removeSession(key);
        }
      }
    }
  }

  getDefaultTimeZone(): any {
    let data;
    if (isPlatformBrowser(this.platformId)) {
      data = window.localStorage.getItem('default-time-zone');
      window.localStorage.setItem('default-time-zone', data || '');
    }
  }

  setDefaultTimeZone(value: any): void {
    const data = value === undefined ? null : JSON.stringify(value);
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem('default-time-zone', data !== null ? JSON.parse(data) : {});
    }
  }


  getLocal(key: string): any {
    let data;
    if (isPlatformBrowser(this.platformId)) {
      data = window.localStorage.getItem(key);
    }
    if (data) {
      return JSON.parse(data || '');

    }
    return null
  }

  setLocal(key: string, value: any): void {
    const data = value === undefined ? null : JSON.stringify(value);
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem(key, data || '');
    }
  }


  removeLocal(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.removeItem(key);
    }
  }

  setTheme(theme: any): void {
    this.setLocal('theme', theme);
  }

  getTheme(): any {
    let data;
    if (isPlatformBrowser(this.platformId)) {
      data = window.sessionStorage.getItem('theme');
    }
    return data;
  }

  removeAllLocals(): void {
    for (const key in window.localStorage) {
      if (isPlatformBrowser(this.platformId)) {
        if (window.localStorage.hasOwnProperty(key)) {
          this.removeLocal(key);
        }
      }
    }
  }

  setUserInformation(data: any) {
    window.localStorage.setItem('userInfo', JSON.stringify(data));
  }

  getDisplayName(): string {
    return JSON.parse(window.localStorage.getItem('displayName'))
  }

  getUserInformation() {
    return JSON.parse(window.localStorage.getItem('userInfo'));
  }

  getUserInformationPromise(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let values = JSON.parse(window.localStorage.getItem('userInfo'));
      resolve(values);
    })
  }

}
