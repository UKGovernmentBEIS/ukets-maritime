import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { AerUncorrectedNonConformities } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { uncorrectedNonConformitiesMap, UncorrectedNonConformitiesStep } from '@requests/common/aer';
import { UncorrectedItemsListTemplateComponent } from '@shared/components/summaries/uncorrected-items-list-template';
import { UncorrectedNonConformitiesPriorYearListTemplateComponent } from '@shared/components/summaries/uncorrected-non-conformities-prior-year-list-template';
import { NotProvidedDirective } from '@shared/directives';
import { BooleanToTextPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-uncorrected-non-conformities-summary-template',
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
    UncorrectedNonConformitiesPriorYearListTemplateComponent,
  ],
  standalone: true,
  templateUrl: './uncorrected-non-conformities-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UncorrectedNonConformitiesSummaryTemplateComponent {
  readonly data = input.required<AerUncorrectedNonConformities>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({ change: true });

  readonly wizardStep = UncorrectedNonConformitiesStep;
  readonly map = uncorrectedNonConformitiesMap;
}
