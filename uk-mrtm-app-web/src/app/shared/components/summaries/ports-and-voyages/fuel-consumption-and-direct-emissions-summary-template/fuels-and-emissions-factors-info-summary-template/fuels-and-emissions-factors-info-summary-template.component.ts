import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import {
  DetailsComponent,
  GovukTableColumn,
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
  TableComponent,
} from '@netz/govuk-components';

import { AER_GWP_VALUES } from '@shared/constants';
import { ScrollablePaneDirective } from '@shared/directives';
import { FuelOriginTitlePipe } from '@shared/pipes';
import { FuelsAndEmissionsFactors } from '@shared/types';

@Component({
  selector: 'mrtm-fuels-and-emissions-factors-info-summary-template',
  standalone: true,
  imports: [
    DetailsComponent,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    TableComponent,
    FuelOriginTitlePipe,
    ScrollablePaneDirective,
  ],
  templateUrl: './fuels-and-emissions-factors-info-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuelsAndEmissionsFactorsInfoSummaryTemplateComponent {
  readonly GWP_VALUES = AER_GWP_VALUES;
  readonly columns: Array<GovukTableColumn<FuelsAndEmissionsFactors>> = [
    { field: 'origin', header: 'Fuel origin', widthClass: 'app-column-width-20-per' },
    { field: 'carbonDioxide', header: 'Tank to Wake emission factor for carbon dioxide' },
    { field: 'methane', header: 'Tank to Wake emission factor for methane' },
    { field: 'nitrousOxide', header: 'Tank to Wake emission factor for nitrous oxide' },
  ];
  readonly data = input<Array<FuelsAndEmissionsFactors>>();
}
