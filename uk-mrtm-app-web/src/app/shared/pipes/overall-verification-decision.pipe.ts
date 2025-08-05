import { Pipe, PipeTransform } from '@angular/core';

import { AerVerificationDecision } from '@mrtm/api';

@Pipe({
  name: 'overallVerificationDecision',
  standalone: true,
})
export class OverallVerificationDecisionPipe implements PipeTransform {
  transform(value: AerVerificationDecision['type']): string {
    switch (value) {
      case 'VERIFIED_AS_SATISFACTORY':
        return 'Verified as satisfactory';
      case 'VERIFIED_AS_SATISFACTORY_WITH_COMMENTS':
        return 'Verified as satisfactory with comments';
      case 'NOT_VERIFIED':
        return 'Not verified';

      default:
        return null;
    }
  }
}
