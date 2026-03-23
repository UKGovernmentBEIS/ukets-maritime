import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { RegulatorReviewResponse } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

@Component({
  selector: 'mrtm-vir-regulator-report-summary-template',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    LinkDirective,
    RouterLink,
  ],
  templateUrl: './vir-regulator-report-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirRegulatorReportSummaryTemplateComponent {
  public readonly header = input<string>();
  public readonly data = input<RegulatorReviewResponse>();
  public readonly isEditable = input<boolean>(false);
  public readonly queryParams = input<Params>({});
  public readonly wizardStep = input<{ [s: string]: string }>({});
}
