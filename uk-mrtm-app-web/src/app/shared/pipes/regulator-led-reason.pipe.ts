import { Pipe, PipeTransform } from '@angular/core';

import { EmpVariationRegulatorLedReason } from '@mrtm/api';

@Pipe({
  name: 'regulatorLedReason',
  standalone: true,
})
export class RegulatorLedReasonPipe implements PipeTransform {
  transform(value: EmpVariationRegulatorLedReason): string {
    switch (value?.type) {
      case 'FOLLOWING_IMPROVING_REPORT':
        return 'Following an improvement report submitted by the maritime operator';
      case 'FAILED_TO_COMPLY_OR_APPLY':
        return 'Maritime operator failed to comply with a requirement in the plan, or to apply in accordance with conditions';
      case 'OTHER':
        return value?.reasonOtherSummary;
      default:
        return null;
    }
  }
}
