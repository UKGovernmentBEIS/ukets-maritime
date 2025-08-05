import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shipStepTitle',
  standalone: true,
})
export class ShipStepTitlePipe implements PipeTransform {
  transform(value: string, step: number, shipName?: string, total: number = 7): string {
    return value + (shipName ? ` for ${shipName}` : '') + `, question ${step} of ${total}`;
  }
}
