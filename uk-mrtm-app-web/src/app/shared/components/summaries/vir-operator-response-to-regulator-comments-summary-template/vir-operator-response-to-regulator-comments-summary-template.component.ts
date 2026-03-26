import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { OperatorImprovementFollowUpResponse } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { BooleanToTextPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-vir-operator-response-to-regulator-comments-summary-template',
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    LinkDirective,
    RouterLink,
    BooleanToTextPipe,
    GovukDatePipe,
  ],
  standalone: true,
  templateUrl: './vir-operator-response-to-regulator-comments-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirOperatorResponseToRegulatorCommentsSummaryTemplateComponent {
  public readonly header = input<string>();
  public readonly data = input<OperatorImprovementFollowUpResponse>();
  public readonly isEditable = input<boolean>(false);
  public readonly queryParams = input<Params>({});
  public readonly wizardStep = input<{ [s: string]: string }>({});
}
