import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { verifierDetailsMap, VerifierDetailsStep } from '@requests/common/aer';
import { AerVerifierDetails } from '@requests/common/aer/aer.types';
import { VerificationBodyDetailsSummaryTemplateComponent } from '@shared/components/summaries/verification-body-details-summary-template';
import { NotProvidedDirective } from '@shared/directives';

@Component({
  selector: 'mrtm-verifier-details-summary-template',
  imports: [
    LinkDirective,
    RouterLink,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    NotProvidedDirective,
    VerificationBodyDetailsSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './verifier-details-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifierDetailsSummaryTemplateComponent {
  readonly data = input<AerVerifierDetails>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({ change: true });

  readonly wizardStep = VerifierDetailsStep;
  readonly map = verifierDetailsMap;
}
