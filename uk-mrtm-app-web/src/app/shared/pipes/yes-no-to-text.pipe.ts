import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'yesNoToText', standalone: true, pure: true })
export class YesNoToTextPipe implements PipeTransform {
  transform(value: 'YES' | 'NO' | 'NOT_APPLICABLE'): string {
    switch (value) {
      case 'YES':
        return 'Yes';
      case 'NO':
        return 'No';
      case 'NOT_APPLICABLE':
        return 'Not applicable';
      default:
        return null;
    }
  }
}
