import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root'
})

export class AlertService {
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private router: Router
    ) { }

    // ========================== snack bar alert
    createSnakBar(text: string, statusClass: string, isOneLine: boolean): void {
        let snakBarHolderBox = this._document.querySelector('.alert-snak-bar');
        const url = this.router.url;
        let itemSnakbar = this._document.createElement('div');
        if (isOneLine) {
            itemSnakbar.className = 'item one-line' + ' ' + statusClass;
        } else {
            itemSnakbar.className = 'item' + ' ' + statusClass;
        }
        itemSnakbar.innerHTML = text;
        if (snakBarHolderBox) {
            snakBarHolderBox.prepend(itemSnakbar);
        } else {
            let holderSnakbar = this._document.createElement('div');
            holderSnakbar.prepend(itemSnakbar);
            if (url.includes('/auth')) {
                holderSnakbar.className = 'alert-snak-bar use-in-auth-page';
                this._document.querySelector('.content-auth').prepend(holderSnakbar);
            } else {
                holderSnakbar.className = 'alert-snak-bar';
                this._document.body.prepend(holderSnakbar);
            }
        }
        setTimeout(() => {
            itemSnakbar.remove();
        }, 5000);
    }

    snackBarSuccess(text: string, isOneLine: boolean = true): void {
        this.createSnakBar(text, 'success', isOneLine);
    }

    snackBarError(text: string, isOneLine: boolean = true): void {
        this.createSnakBar(text, 'error', isOneLine);
    }

    snackBarWarning(text: string, isOneLine: boolean = true): void {
        this.createSnakBar(text, 'warning', isOneLine);
    }

}

