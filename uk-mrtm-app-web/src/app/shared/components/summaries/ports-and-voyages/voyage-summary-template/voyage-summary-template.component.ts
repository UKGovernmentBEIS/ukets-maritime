import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { AerVoyage } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  LinkDirective,
  SummaryListColumnActionsDirective,
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { AerVoyagesWizardStep } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { FuelConsumptionAndDirectEmissionsSummaryTemplateComponent } from '@shared/components/summaries/ports-and-voyages/fuel-consumption-and-direct-emissions-summary-template';
import { VoyageOrPortCallEmissionsSummaryTemplateComponent } from '@shared/components/summaries/ports-and-voyages/voyage-or-port-call-emissions-summary-template';
import { AER_PORT_CODE_SELECT_ITEMS, AER_PORT_COUNTRY_SELECT_ITEMS } from '@shared/constants';
import { SelectOptionToTitlePipe } from '@shared/pipes';
import { AerJourneyTypeEnum } from '@shared/types';

@Component({
  selector: 'mrtm-voyage-summary-template',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListColumnActionsDirective,
    LinkDirective,
    SelectOptionToTitlePipe,
    RouterLink,
    GovukDatePipe,
    DatePipe,
    FuelConsumptionAndDirectEmissionsSummaryTemplateComponent,
    VoyageOrPortCallEmissionsSummaryTemplateComponent,
  ],
  templateUrl: './voyage-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoyageSummaryTemplateComponent {
  readonly data = input<AerVoyage & { journeyType?: AerJourneyTypeEnum }>();
  readonly editable = input<boolean>(false);

  readonly wizardStep = AerVoyagesWizardStep;
  readonly editQueryParams = input<Params>();
  readonly countries = AER_PORT_COUNTRY_SELECT_ITEMS;
  readonly ports = AER_PORT_CODE_SELECT_ITEMS;
}
