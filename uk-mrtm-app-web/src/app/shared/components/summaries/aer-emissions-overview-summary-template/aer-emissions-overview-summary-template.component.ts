import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AerTotalEmissions } from '@mrtm/api';

import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { BigNumberPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-aer-emissions-overview-summary-template',
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    BigNumberPipe,
  ],
  standalone: true,
  templateUrl: './aer-emissions-overview-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerEmissionsOverviewSummaryTemplateComponent {
  readonly data = input<AerTotalEmissions>();
  readonly hasBottomMargin = input<boolean>(true);
}
