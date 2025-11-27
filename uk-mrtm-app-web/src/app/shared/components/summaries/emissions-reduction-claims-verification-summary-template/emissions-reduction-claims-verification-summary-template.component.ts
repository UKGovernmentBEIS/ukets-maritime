import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { AerEmissionsReductionClaimVerification } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { NotProvidedDirective } from '@shared/directives';
import { BooleanToTextPipe } from '@shared/pipes';
import { SubTaskListMap } from '@shared/types';

@Component({
  selector: 'mrtm-emissions-reduction-claims-verification-summary-template',
  standalone: true,
  imports: [
    LinkDirective,
    RouterLink,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    NotProvidedDirective,
    BooleanToTextPipe,
  ],
  templateUrl: './emissions-reduction-claims-verification-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmissionsReductionClaimsVerificationSummaryTemplateComponent {
  readonly data = input<AerEmissionsReductionClaimVerification>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({ change: true });

  readonly wizardStep = input<Record<string, any>>();
  readonly map = input<SubTaskListMap<AerEmissionsReductionClaimVerification>>();
}
