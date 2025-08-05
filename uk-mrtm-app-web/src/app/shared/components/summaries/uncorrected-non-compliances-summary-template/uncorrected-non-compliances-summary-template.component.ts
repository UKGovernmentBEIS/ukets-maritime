import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { AerUncorrectedNonCompliances } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { uncorrectedNonCompliancesMap, UncorrectedNonCompliancesStep } from '@requests/common/aer';
import { UncorrectedItemsListTemplateComponent } from '@shared/components/summaries/uncorrected-items-list-template';
import { NotProvidedDirective } from '@shared/directives';
import { BooleanToTextPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-uncorrected-non-compliances-summary-template',
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
    UncorrectedItemsListTemplateComponent,
  ],
  templateUrl: './uncorrected-non-compliances-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UncorrectedNonCompliancesSummaryTemplateComponent {
  readonly data = input.required<AerUncorrectedNonCompliances>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({ change: true });

  readonly wizardStep = UncorrectedNonCompliancesStep;
  readonly map = uncorrectedNonCompliancesMap;
}
