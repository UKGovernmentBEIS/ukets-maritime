import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'booleanToText', standalone: true, pure: true })
export class BooleanToTextPipe implements PipeTransform {
  transform(value: boolean | undefined | null): string {
    return value === true ? 'Yes' : value === false ? 'No' : null;
  }
}
