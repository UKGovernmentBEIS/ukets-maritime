import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { NonComplianceFinalDetermination } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { GovukDatePipe } from '@netz/common/pipes';
import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import {
  nonComplianceFinalDeterminationDetailsMap,
  NonComplianceFinalDeterminationDetailsStep,
} from '@requests/common/non-compliance';
import { NotProvidedDirective } from '@shared/directives';
import { BooleanToTextPipe, YesNoToTextPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-non-compliance-final-determination-details-summary-template',
  standalone: true,
  imports: [
    LinkDirective,
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    NotProvidedDirective,
    RouterLink,
    BooleanToTextPipe,
    GovukDatePipe,
    YesNoToTextPipe,
  ],
  templateUrl: './non-compliance-final-determination-details-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceFinalDeterminationDetailsSummaryTemplateComponent {
  private readonly authStore = inject(AuthStore);
  readonly userRole = this.authStore.select(selectUserRoleType);

  readonly data = input.required<NonComplianceFinalDetermination>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({ change: true });

  readonly wizardStep = NonComplianceFinalDeterminationDetailsStep;
  readonly map = nonComplianceFinalDeterminationDetailsMap;
}
