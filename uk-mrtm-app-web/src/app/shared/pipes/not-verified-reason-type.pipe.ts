import { Pipe, PipeTransform } from '@angular/core';

import { AerNotVerifiedDecisionReason } from '@mrtm/api';

@Pipe({ name: 'notVerifiedReasonType', standalone: true, pure: true })
export class NotVerifiedReasonTypePipe implements PipeTransform {
  transform(value: AerNotVerifiedDecisionReason['type']): string {
    switch (value) {
      case 'UNCORRECTED_MATERIAL_MISSTATEMENT':
        return 'An uncorrected material misstatement (individual or in aggregate)';
      case 'UNCORRECTED_MATERIAL_NON_CONFORMITY':
        return 'An uncorrected material non-conformity (individual or in aggregate)';
      case 'VERIFICATION_DATA_OR_INFORMATION_LIMITATIONS':
        return 'Limitations in the data or information made available for verification';
      case 'SCOPE_LIMITATIONS_DUE_TO_LACK_OF_CLARITY':
        return 'Limitations of scope due to lack of clarity';
      case 'SCOPE_LIMITATIONS_OF_APPROVED_MONITORING_PLAN':
        return 'Limitations of scope of the approved emissions monitoring plan';
      case 'NOT_APPROVED_MONITORING_PLAN_BY_REGULATOR':
        return 'The emissions monitoring plan is not approved by the regulator';
      case 'ANOTHER_REASON':
        return 'Another reason';
      default:
        return null;
    }
  }
}
