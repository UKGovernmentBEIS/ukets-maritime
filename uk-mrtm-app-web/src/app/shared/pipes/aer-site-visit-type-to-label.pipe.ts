import { Pipe, PipeTransform } from '@angular/core';

import { AerSiteVisitType } from '@requests/common/aer/aer.types';
import { aerSiteVisitTypeToLabelTransformer } from '@shared/utils';

@Pipe({
  name: 'aerSiteVisitTypeToLabel',
  standalone: true,
})
export class AerSiteVisitTypeToLabelPipe implements PipeTransform {
  transform(value: AerSiteVisitType): string {
    return aerSiteVisitTypeToLabelTransformer(value);
  }
}
