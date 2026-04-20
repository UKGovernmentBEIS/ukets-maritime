import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AerShipEmissions } from '@mrtm/api';

import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import {
  AerAggregatedDataWizardStep,
  mapAggregatedDataToAnnualEmissionsItems,
  mapAggregatedDataToTotalShipEmissionsItems,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { AerAggregatedDataEmissionsCalculationsSummaryTemplateComponent } from '@shared/components/summaries/aggregated-data/aer-aggregated-data-emissions-calculations-summary-template';
import { AerAggregatedDataFuelConsumptionsSummaryTemplateComponent } from '@shared/components/summaries/aggregated-data/aer-aggregated-data-ship-summary-template/aer-aggregated-data-fuel-consumptions-summary-template';
import { AerAggregatedDataEmissionDto, AerAggregatedDataShipSummary } from '@shared/types';

@Component({
  selector: 'mrtm-aer-aggregated-data-ship-summary-template',
  standalone: true,
  imports: [
    RouterLink,
    LinkDirective,
    AerAggregatedDataEmissionsCalculationsSummaryTemplateComponent,
    AerAggregatedDataFuelConsumptionsSummaryTemplateComponent,
    ButtonDirective,
  ],
  templateUrl: './aer-aggregated-data-ship-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerAggregatedDataShipSummaryTemplateComponent {
  readonly editable = input<boolean>(false);
  readonly aggregatedData = input<AerAggregatedDataShipSummary>();
  readonly ship = input<AerShipEmissions>();

  readonly wizardStep = AerAggregatedDataWizardStep;

  readonly totalShipEmissionsData = computed<Array<AerAggregatedDataEmissionDto>>(() =>
    mapAggregatedDataToTotalShipEmissionsItems(this.aggregatedData()),
  );
  readonly annualEmissions = computed<Array<AerAggregatedDataEmissionDto>>(() =>
    mapAggregatedDataToAnnualEmissionsItems(this.aggregatedData()),
  );
}
