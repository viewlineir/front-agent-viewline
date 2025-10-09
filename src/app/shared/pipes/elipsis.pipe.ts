import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'elipsis',
  standalone: true
})
export class ElipsisPipe implements PipeTransform {

  transform(value: string, maxCharCountToShow: number): unknown {
    value = value.replace(/\n/g, ' ');

    if (value.length > maxCharCountToShow) {
      let text = value.substring(0, maxCharCountToShow);
      text = text.substring(0, text.lastIndexOf(' '));
      return (text + ' ...');
    }
    return value;
  }

}
