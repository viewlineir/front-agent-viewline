import { Pipe, PipeTransform } from '@angular/core';
import { ESizeType } from '../types/size.type';

@Pipe({
  name: 'splitFileSize',
  standalone: true
})
export class SplitFileSizePipe implements PipeTransform {

  sizeType = ESizeType;

  transform(value: number): unknown {
    let returnText;
    if (value < 1024) {
      returnText = value + ' بایت';
    } else if (value < 1048576) {
      let valueKb = value / 1024;
      returnText = valueKb.toFixed(2) + ' کیلوبایت';
    } else {
      let valueMb = value / 1048576;
      returnText = valueMb.toFixed(2) + ' کیلوبایت';
    }
    return returnText;
  }

}
