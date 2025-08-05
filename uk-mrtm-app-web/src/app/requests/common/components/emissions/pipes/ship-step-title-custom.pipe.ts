import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shipStepTitleCustom',
  standalone: true,
})
export class ShipStepTitleCustomPipe implements PipeTransform {
  transform(value: string, step: number, total: number = 7): string {
    return `${value}, question ${step} of ${total}`;
  }
}
