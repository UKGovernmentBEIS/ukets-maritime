import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AerPortEmissionsMeasurement } from '@mrtm/api';

import {
  GovukTableColumn,
  LinkDirective,
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
  TableComponent,
} from '@netz/govuk-components';

import { AER_EMISSIONS_CALCULATIONS_STEP } from '@requests/common/aer/aer.consts';
import { VOYAGE_OR_PORT_CALL_EMISSIONS_SUMMARY_COLUMNS } from '@shared/components/summaries/ports-and-voyages/voyage-or-port-call-emissions-summary-template/voyage-or-port-call-emissions-summary-template.consts';
import { ScrollablePaneDirective } from '@shared/directives';
import { BigNumberPipe } from '@shared/pipes';
import { AerJourneyTypeEnum, AerVoyageOrPortCalculationsSummaryItemDto } from '@shared/types';

@Component({
  selector: 'mrtm-voyage-or-port-call-emissions-summary-template',
  imports: [
    TableComponent,
    BigNumberPipe,
    LinkDirective,
    RouterLink,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    TitleCasePipe,
    ScrollablePaneDirective,
  ],
  standalone: true,
  templateUrl: './voyage-or-port-call-emissions-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoyageOrPortCallEmissionsSummaryTemplateComponent {
  readonly columns: Array<GovukTableColumn<AerVoyageOrPortCalculationsSummaryItemDto>> =
    VOYAGE_OR_PORT_CALL_EMISSIONS_SUMMARY_COLUMNS;
  readonly header = input<string>();
  readonly journeyType = input<AerJourneyTypeEnum>();
  readonly totalEmissions = input<AerPortEmissionsMeasurement>();
  readonly surrenderEmissions = input<AerPortEmissionsMeasurement>();
  readonly editStep = AER_EMISSIONS_CALCULATIONS_STEP;
  readonly isSummary = input<boolean>(false);
  readonly editable = input<boolean>(false);
  readonly data: Signal<Array<AerVoyageOrPortCalculationsSummaryItemDto>> = computed(() => {
    const totalInPortEmissions = this.totalEmissions();
    const surrenderFigureForEmissions = this.surrenderEmissions();

    return !totalInPortEmissions && !surrenderFigureForEmissions
      ? []
      : [
          {
            emission: 'TOTAL',
            ...totalInPortEmissions,
          },
          {
            emission: 'SURRENDER',
            ...surrenderFigureForEmissions,
          },
        ];
  });
}
