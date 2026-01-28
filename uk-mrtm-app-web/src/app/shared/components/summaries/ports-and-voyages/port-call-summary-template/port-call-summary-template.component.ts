import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';

import { AerPort } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  LinkDirective,
  SummaryListColumnActionsDirective,
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { AerPortsWizardStep } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { FuelConsumptionAndDirectEmissionsSummaryTemplateComponent } from '@shared/components/summaries/ports-and-voyages/fuel-consumption-and-direct-emissions-summary-template';
import { VoyageOrPortCallEmissionsSummaryTemplateComponent } from '@shared/components/summaries/ports-and-voyages/voyage-or-port-call-emissions-summary-template';
import { AER_PORT_CODE_SELECT_ITEMS, AER_PORT_COUNTRY_SELECT_ITEMS } from '@shared/constants';
import { SelectOptionToTitlePipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-port-call-summary-template',
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
    VoyageOrPortCallEmissionsSummaryTemplateComponent,
    FuelConsumptionAndDirectEmissionsSummaryTemplateComponent,
  ],
  templateUrl: './port-call-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortCallSummaryTemplateComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly data = input<AerPort>();
  readonly editable = input<boolean>(false);
  readonly editQueryParams = input<Params>({ change: true });
  readonly countries = AER_PORT_COUNTRY_SELECT_ITEMS;
  readonly ports = AER_PORT_CODE_SELECT_ITEMS;
  readonly wizardStep = AerPortsWizardStep;

  public onAddDirectEmissions(): void {
    this.router.navigate([this.wizardStep.IN_PORT_EMISSIONS, this.wizardStep.DIRECT_EMISSIONS], {
      relativeTo: this.activatedRoute,
    });
  }
}
