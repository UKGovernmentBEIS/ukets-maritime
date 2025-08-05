import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
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
  public readonly data: InputSignal<Array<AerAggregatedDataFuelConsumption>> =
    input<Array<AerAggregatedDataFuelConsumption>>();
  public readonly editable: InputSignal<boolean> = input<boolean>();
  public readonly changeLink: InputSignal<string> = input<string>();
  public readonly queryParams: InputSignal<Params> = input<Params>();
}
