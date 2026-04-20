import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
  standalone: true,
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
  templateUrl: './data-gaps-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGapsSummaryTemplateComponent {
  @Input({ required: true }) dataGaps: EmpDataGaps;
  @Input() originalDataGaps: EmpDataGaps;
  @Input() wizardStep: { [s: string]: string };
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
}
