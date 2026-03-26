import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { RegulatorImprovementResponse } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { NotProvidedDirective } from '@shared/directives';
import { BooleanToTextPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-vir-regulator-response-summary-template',
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    BooleanToTextPipe,
    GovukDatePipe,
    RouterLink,
    LinkDirective,
    NotProvidedDirective,
  ],
  standalone: true,
  templateUrl: './vir-regulator-response-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirRegulatorResponseSummaryTemplateComponent {
  public readonly header = input<string>();
  public readonly data = input<RegulatorImprovementResponse>();
  public readonly isEditable = input<boolean>(false);
  public readonly queryParams = input<Params>({});
  public readonly wizardStep = input<{ [s: string]: string }>({});
}
