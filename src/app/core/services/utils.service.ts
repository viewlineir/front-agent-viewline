import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, defer, from, map, catchError } from 'rxjs';
import moment from 'jalali-moment';
import { MatDialog } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})

export class UtilsService {

    constructor(
        public dialog: MatDialog,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    handleResponse(response: any): any {
        return response && response['data'] || {};
    }
    static handleResponse(response: any): any {
        return response && response['data'] || {};
    }

    handleSendAllResponse(response: any): any {
        return response || {};
    }
    static handleSendAllResponse(response: any): any {
        return response || {};
    }

    //#region =======================date
    getJalaliDate(value: string, format: string = 'jYYYY/jMM/jDD'): string {
        return moment(value, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD');
    }

    getJalaliToGregorianDate(value: string, fromFotmat: string = 'YYYY/MM/DD', toFormat: string = 'YYYY/MM/DD'): string {
        return moment.from(value, 'fa', fromFotmat).locale('en').format(toFormat);
    }

    changeGregorianDateFormat(value: string, fromFotmat: string, toFormat: string): string {
        return moment.from(value, 'en', fromFotmat).locale('en').format(toFormat);
    }

    getJalaliDateByDash(value: string): string {
        return moment(value, 'YYYY/MM/DD').locale('fa').format('jYYYY-jMM-jDD');
    }

    changeFormatDate(event: any, time: string): string {
        // let value = this.datePipe.transform(event, 'YYYY-MM-dd') || '';
        const value = moment(event).locale('en').format('YYYY-MM-DD');
        return `${value}T${time}.000Z`;
    }

    //#endregion

    // images
    getAllowExtentions(allowedExt: string[]): string {
        return allowedExt.join(', ').toUpperCase();
    }

    isFileValid(file: any, allowedExt: string, maxSize: number): boolean {

        // check file extension
        if (!allowedExt.toUpperCase().includes(file.name.toUpperCase().split('.').pop())) {
            return false;
        }

        // check file size
        if (file.size > maxSize) {
            return false;
        }

        return true;
    }


    makeInlineAlertTextsForFileValidation(file: any, allowedExt: string, maxSize: number): string[] {
        const inlineAlertTexts: string[] = [];
        // check file extension
        if (
            !allowedExt.toUpperCase().includes(file.name.toUpperCase().split('.').pop())) {
            inlineAlertTexts.push(`تنها فایل هایی با پسوندهای زیر مجاز است : ${allowedExt}`);
        }

        // check file size
        if (file.size > maxSize) {
            let mbMaxSize = (maxSize / 1048578);
            if ((mbMaxSize % 1) != 0) {
                mbMaxSize = parseFloat(mbMaxSize.toFixed(2));
            }
            inlineAlertTexts.push(`حجم فایل مورد نظر بیشتر از حد مجاز است.`);
        }

        return inlineAlertTexts;
    }

    dataURItoBlob(dataURI: string) {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }

    //#region  ==============get image size ratio
    getImageSizeRatio(imageUrl: string): Observable<number> {
        return defer(() => {
            const img = new Image();
            img.src = imageUrl;

            return from(new Promise<number>((resolve, reject) => {
                img.onload = () => {
                    const ratio = img.width / img.height;
                    resolve(ratio);
                };

                img.onerror = () => {
                    reject('Failed to load image');
                };
            }));
        }).pipe(
            map(ratio => ratio),
            catchError(() => {
                return [];
            })
        );
    }
    //#endregion
    //#region  ==============remove Space Text For Route Link
    removeSpaceTextForRouteLink(title: string): string {
        let text = title;
        if (text.indexOf(' ') >= 0) {
            text = text.replace(/\s+-\s+/g, '-');
            text = text.replace(/\//g, '-');
            text = text.replace(/\s+/g, '-');
        }
        return text;
    }
    //#endregion

    chekcIfConnection(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (window.navigator.onLine) {
                return true;
            }
        }
        return false;
    }

    MakeFiltersForTable<T extends object>(formControls: any) {
        let filter = {} as T;
        let filters: any[] = [];
        Object.keys(formControls).forEach(key => {
            if (typeof formControls[key].value === 'boolean') {
                filters.push({ [key]: formControls[key].value });
            } else {
                if (formControls[key].value && (formControls[key].value + '').length > 0) {
                    filters.push({ [key]: formControls[key].value });
                }
            }
        });
        Object.assign(filter, ...filters);
        return filter;
    }

    MakeFiltersForTableObject<T extends object>(object: any) {
        let filter = {} as T;
        let filters: any[] = [];
        Object.keys(object).forEach(key => {
            if (typeof object[key] === 'boolean') {
                filters.push({ [key]: object[key] });
            } else {
                if (object[key] && (object[key] + '').length > 0) {
                    filters.push({ [key]: object[key] });
                }
            }
        });
        Object.assign(filter, ...filters);
        return filter;
    }
}
