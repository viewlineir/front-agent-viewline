import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
@Component({
    template: ''
})
export abstract class BaseComponent implements OnDestroy {

    public subscriptions: Subscription[] = [];


    ngOnDestroy(): void {
        if (this.subscriptions) {
            this.subscriptions.forEach(subscription => subscription.unsubscribe());
        }
    }

}
