import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-countdown',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './countdown.component.html',
    styleUrls: ['./countdown.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CountdownComponent implements OnInit, OnChanges {
    // Output
    @Output() requestResendCodeEmit = new EventEmitter<boolean>();

    // Input
    @Input({ required: true }) leftTime: number;
    @Input() loading: boolean = false;

    // Subjec Or Subscription
    timerInterval: any;

    // number
    minute: number;
    seconds: number;

    // boolean
    timeFinished: boolean = false;

    constructor() {
    }
    //==================================
    // #region LIFE CYCLE HOOK 
    //==================================
    ngOnInit(): void {
        
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes['loading']) {
          if(changes['loading'].currentValue === false){
            this.timeFinished = false;
            this.startTimer();
          }
        }
      }
    //#endregion
    //==================================
    // #region PRIVATE 
    //==================================
    private startTimer(): void {
        clearInterval(this.timerInterval);
        if (this.leftTime >= 60) {
            this.minute = Math.round(this.leftTime / 60);
        } else {
            this.minute = 0;
        }
        this.seconds = this.leftTime % 60;
        // this.seconds = 59;
        this.timerInterval = setInterval(() => {
            if (this.seconds > 0) {
                --this.seconds;

            } else if (this.minute > 0) {
                --this.minute;
                this.seconds = 59;

            } else {
                this.timeFinished = true;
                clearInterval(this.timerInterval);
            }

        }, 1000);

    }
    //#endregion
    //==================================
    // #region PUBLIC 
    //==================================
    sendRequestForResendCode(): void {
        this.requestResendCodeEmit.emit(true);
    }
    //#endregion

}
