import { Directive, ElementRef, Input, OnChanges, OnInit, Optional, Self, SimpleChanges } from '@angular/core';
import { NgControl } from '@angular/forms';
@Directive({
  selector: '[handlerAmount]',
  standalone: true
})
export class HandlerAmountDirective implements OnChanges, OnInit {

  @Input() value: string = '';
  @Input() precision: number;

  regex: RegExp;
  connectedToform: boolean;

  constructor(
    private el: ElementRef,
    @Optional() @Self() public ngControl: NgControl
  ) { }

  ngOnInit(): void {
    const pattern = '^\\d*\\.?\\d{0,' + this.precision + '}$';
    this.regex = new RegExp(pattern);

    if (this.ngControl !== null) {
      this.connectedToform = true;
      this.ngControl.valueChanges.subscribe(res => {
        this.handleAmount(res);
      })
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['precision']) {
      const pattern = '^\\d*\\.?\\d{0,' + this.precision + '}$';
      this.regex = new RegExp(pattern);
    }
    this.handleAmount(this.connectedToform ? this.ngControl.value : this.value);

  }

  private handleAmount(value: string): void {
    // this arrey contains two string: 1. main number 2. decimal number(number after point)
    if(!this.precision && (value && value.toString().startsWith("0"))){
			this.el.nativeElement.value ="";
      return;
		}
    if(!this.precision && (value && value.toString().includes("."))){
			value.toString().replace(".","");
		}
		if(value && value.toString().startsWith(".")){
			this.el.nativeElement.value ="";
			return;
		}
		if (value && value.toString().length>1 && value.toString().startsWith("0") && !value.toString().startsWith("0.")){
      this.el.nativeElement.value ="0";
			return;
		}

    value = this.removeSeparator(value);
    let arrayValue = value.split(".");
    let newValue = this.setThousandSeperator(this.removeExtraNumbers(arrayValue[0])) + this.checkPrecision(arrayValue[1]);
    this.el.nativeElement.value = newValue;
  }

  private checkPrecision(value: string): string {
    if (value === undefined) {
      return '';
    }
    const pointPosition = value.indexOf('.');
    if(this.precision !== 0){
      return pointPosition ? ('.' + value.substring(pointPosition, this.precision)) : '';
    } else {
      return '';
    }
  }

  private removeExtraNumbers(value: string): string {
    return value.substring(0, 13);
  }

  private setThousandSeperator(value: string): string {
    let amount = value.replace(/([۰-۹])/g, token => String.fromCharCode(token.charCodeAt(0) - 1728));
    amount = amount.replace(/[^0-9\.]/g, '');
    amount = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return amount;
  }

  private removeSeparator(value: string): string {
    if (!value) { return ''; }
    return value.toString().replace(/,/g, '');
  }



}

