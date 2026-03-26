import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AerShipAggregatedData } from '@mrtm/api';

import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { NotProvidedDirective } from '@shared/directives';
import { BigNumberPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-aer-aggregated-data-ship-emissions-calculated-totals',
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    BigNumberPipe,
    NotProvidedDirective,
  ],
  standalone: true,
  templateUrl: './aer-aggregated-data-ship-emissions-calculated-totals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerAggregatedDataShipEmissionsCalculatedTotalsComponent {
  public readonly data = input<Pick<AerShipAggregatedData, 'totalShipEmissions' | 'surrenderEmissions'>>();
}
