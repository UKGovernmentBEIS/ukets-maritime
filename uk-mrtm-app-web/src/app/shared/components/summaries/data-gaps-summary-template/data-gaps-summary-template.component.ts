import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { EmpDataGaps } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { HtmlDiffDirective } from '@shared/directives';

@Component({
  selector: 'mrtm-data-gaps-summary-template',
  imports: [
    LinkDirective,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    RouterLink,
    HtmlDiffDirective,
  ],
  standalone: true,
  templateUrl: './data-gaps-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGapsSummaryTemplateComponent {
  readonly dataGaps = input.required<EmpDataGaps>();
  readonly originalDataGaps = input<EmpDataGaps>();
  readonly wizardStep = input<{
    [s: string]: string;
  }>();
  readonly isEditable = input(false);
  readonly queryParams = input<Params>({});
}
