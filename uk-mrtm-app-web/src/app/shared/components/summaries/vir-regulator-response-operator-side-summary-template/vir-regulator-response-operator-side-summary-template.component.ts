import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RegulatorImprovementResponse } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

@Component({
  selector: 'mrtm-vir-regulator-response-operator-side-summary-template',
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    GovukDatePipe,
  ],
  standalone: true,
  templateUrl: './vir-regulator-response-operator-side-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirRegulatorResponseOperatorSideSummaryTemplateComponent {
  public readonly header = input<string>();
  public readonly data = input<RegulatorImprovementResponse>();
}
