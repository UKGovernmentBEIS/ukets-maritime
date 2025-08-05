import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { AerUncorrectedMisstatements } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { uncorrectedMisstatementsMap, UncorrectedMisstatementsStep } from '@requests/common/aer';
import { UncorrectedItemsListTemplateComponent } from '@shared/components/summaries/uncorrected-items-list-template';
import { NotProvidedDirective } from '@shared/directives';
import { BooleanToTextPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-uncorrected-misstatements-summary-template',
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
  templateUrl: './uncorrected-misstatements-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UncorrectedMisstatementsSummaryTemplateComponent {
  readonly data = input.required<AerUncorrectedMisstatements>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({ change: true });

  readonly wizardStep = UncorrectedMisstatementsStep;
  readonly map = uncorrectedMisstatementsMap;
}
