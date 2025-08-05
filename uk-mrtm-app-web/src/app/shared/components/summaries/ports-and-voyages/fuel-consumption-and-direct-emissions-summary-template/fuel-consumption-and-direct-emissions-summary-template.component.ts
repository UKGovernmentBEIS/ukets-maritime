import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { AerFuelConsumption, AerPortEmissionsMeasurement } from '@mrtm/api';

import {
  ButtonDirective,
  LinkDirective,
  SummaryListColumnActionsDirective,
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
  TabDirective,
  TableComponent,
  TabsComponent,
} from '@netz/govuk-components';

import { FUEL_CONSUMPTIONS_SUMMARY_COLUMNS } from '@shared/components/summaries/ports-and-voyages/fuel-consumption-and-direct-emissions-summary-template/fuel-consumption-and-direct-emissions-summary-template.consts';
import { FuelsAndEmissionsFactorsInfoSummaryTemplateComponent } from '@shared/components/summaries/ports-and-voyages/fuel-consumption-and-direct-emissions-summary-template/fuels-and-emissions-factors-info-summary-template';
import { AER_PORT_MEASURING_UNIT_SELECT_ITEMS } from '@shared/constants';
import { FuelOriginTitlePipe, SelectOptionToTitlePipe } from '@shared/pipes';
import { BigNumberPipe } from '@shared/pipes/big-number.pipe';
import { MethaneSlipValuePipe } from '@shared/pipes/methane-slip-value.pipe';
import { FuelsAndEmissionsFactors } from '@shared/types';

@Component({
  selector: 'mrtm-fuel-consumption-and-direct-emissions-summary-template',
  standalone: true,
  imports: [
    TabsComponent,
    TabDirective,
    LinkDirective,
    RouterLink,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListColumnActionsDirective,
    BigNumberPipe,
    TableComponent,
    FuelOriginTitlePipe,
    SelectOptionToTitlePipe,
    FuelsAndEmissionsFactorsInfoSummaryTemplateComponent,
    MethaneSlipValuePipe,
    ButtonDirective,
  ],
  templateUrl: './fuel-consumption-and-direct-emissions-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuelConsumptionAndDirectEmissionsSummaryTemplateComponent {
  public readonly editable = input<boolean>(false);
  public readonly deletable = input<boolean>(false);
  public readonly isSummary = input<boolean>(true);
  public readonly directEmissions = input<AerPortEmissionsMeasurement>();
  public readonly fuelConsumptions = input<Array<AerFuelConsumption>>([]);
  public readonly emissionFactors = input<Array<FuelsAndEmissionsFactors>>();
  public readonly directEmissionsEditPath = input<string>('.');
  public readonly fuelConsumptionsEditPath = input<string>('.');
  public readonly editQueryParams = input<Params>();
  public readonly columns = FUEL_CONSUMPTIONS_SUMMARY_COLUMNS;
  public readonly measurementUnits = AER_PORT_MEASURING_UNIT_SELECT_ITEMS;
  public readonly removeDirectEmission = output<void>();
  public readonly removeFuelConsumption = output<AerFuelConsumption>();
  public readonly addDirectEmission = output<void>();

  public onAddDirectEmission(): void {
    this.addDirectEmission.emit();
  }
}
