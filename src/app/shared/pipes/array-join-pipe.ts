import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayJoin',
  standalone: true
})
export class ArrayJoinPipe implements PipeTransform {

  transform(value: string[] | null | undefined, separator: string = ', '): string {
    if (!value || !Array.isArray(value)) {
      return '';
    }
    return value.join(separator);
  }

}
