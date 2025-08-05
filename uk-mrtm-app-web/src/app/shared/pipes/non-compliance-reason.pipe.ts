import { Pipe, PipeTransform } from '@angular/core';

import { NonComplianceReason } from '@shared/types';

@Pipe({
  name: 'nonComplianceReason',
  standalone: true,
  pure: true,
})
export class NonComplianceReasonPipe implements PipeTransform {
  transform(value: NonComplianceReason): string {
    switch (value) {
      case 'FAILURE_TO_APPLY_FOR_AN_EMISSIONS_MONITORING_PLAN':
        return 'Failure to apply for an emissions monitoring plan';
      case 'FAILURE_TO_COMPLY_WITH_A_CONDITION_OF_AN_EMISSIONS_MONITORING_PLAN':
        return 'Failure to comply with a condition of an emissions monitoring plan';
      case 'FAILURE_TO_MONITOR_EMISSIONS':
        return 'Failure to monitor emissions';
      case 'FAILURE_TO_REPORT_EMISSIONS':
        return 'Failure to report emissions';
      case 'FAILURE_TO_COMPLY_WITH_DEFICIT_NOTICE':
        return 'Failure to comply with deficit notice';
      case 'FAILURE_TO_COMPLY_WITH_AN_ENFORCEMENT_NOTICE':
        return 'Failure to comply with an enforcement notice';
      case 'FAILURE_TO_COMPLY_WITH_AN_INFORMATION_NOTICE':
        return 'Failure to comply with an information notice';
      case 'PROVIDING_FALSE_OR_MISLEADING_INFORMATION':
        return 'Providing false or misleading information';
      case 'REFUSAL_TO_ALLOW_ACCESS_TO_PREMISES':
        return 'Refusal to allow access to premises';
      case 'FAILURE_TO_SURRENDER_ALLOWANCE_100':
        return 'Failure to surrender allowance (£100/allowance)';
      case 'FAILURE_TO_SURRENDER_ALLOWANCE_20':
        return 'Failure to surrender allowance (£20/allowance)';

      default:
        return null;
    }
  }
}
