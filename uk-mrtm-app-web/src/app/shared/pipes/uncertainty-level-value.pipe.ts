import { Pipe, PipeTransform } from '@angular/core';

import { UncertaintyLevel } from '@mrtm/api';

@Pipe({
  name: 'uncertaintyLevelValue',
  standalone: true,
})
export class UncertaintyLevelValuePipe implements PipeTransform {
  transform(value: UncertaintyLevel): string {
    return value?.methodApproach === 'DEFAULT' ? `± ${value?.value}` : value?.value;
  }
}
