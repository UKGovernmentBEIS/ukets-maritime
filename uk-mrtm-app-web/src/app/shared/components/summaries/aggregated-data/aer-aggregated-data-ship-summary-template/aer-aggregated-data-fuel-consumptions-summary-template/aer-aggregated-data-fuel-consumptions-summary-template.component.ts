import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { AerAggregatedDataFuelConsumption } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { NotProvidedDirective } from '@shared/directives';
import { BigNumberPipe, FuelOriginTitlePipe } from '@shared/pipes';
import { WithNeedsReview } from '@shared/types';

@Component({
  selector: 'mrtm-aer-aggregated-data-fuel-consumptions-summary-template',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    BigNumberPipe,
    NotProvidedDirective,
    FuelOriginTitlePipe,
    LinkDirective,
    RouterLink,
  ],
  templateUrl: './aer-aggregated-data-fuel-consumptions-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerAggregatedDataFuelConsumptionsSummaryTemplateComponent {
  readonly data = input<Array<WithNeedsReview<AerAggregatedDataFuelConsumption>>>();
  readonly editable = input<boolean>();
  readonly changeLink = input<string>();
  readonly queryParams = input<Params>();
}
