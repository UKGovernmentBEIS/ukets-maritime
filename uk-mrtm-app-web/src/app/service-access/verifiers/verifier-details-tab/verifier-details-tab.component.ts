import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { VerificationBodiesService } from '@mrtm/api';

import { VerificationBodySummaryComponent } from '@shared/components/summaries/verification-body-summary';

@Component({
  selector: 'mrtm-verifier-details-tab',
  imports: [VerificationBodySummaryComponent],
  standalone: true,
  template: `
    <h2 class="govuk-heading-m">Details</h2>
    <mrtm-verification-body-summary [summaryInfo]="verificationBodyDetails()" [editable]="false" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifierDetailsTabComponent {
  readonly verificationBodyDetails = toSignal(inject(VerificationBodiesService).getVerificationBodyDetails());
}
