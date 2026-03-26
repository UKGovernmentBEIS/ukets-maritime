import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { AerVerificationDecision } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { OverallVerificationDecisionStep } from '@requests/common/aer/subtasks/overall-verification-decision/overall-verification-decision.helpers';
import { overallVerificationDecisionMap } from '@requests/common/aer/subtasks/overall-verification-decision/overall-verification-decision-subtask-list.map';
import { NotProvidedDirective } from '@shared/directives';
import { NotVerifiedReasonTypePipe, OverallVerificationDecisionPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-aer-overall-verification-decision-summary-template',
  imports: [
    LinkDirective,
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    NotProvidedDirective,
    RouterLink,
    OverallVerificationDecisionPipe,
    NotVerifiedReasonTypePipe,
  ],
  standalone: true,
  templateUrl: './aer-overall-verification-decision-summary-template.component.html',
  styles: `
    .govuk-summary-list__key {
      width: 20%;
    }
    .govuk-summary-list__actions {
      width: 10%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerOverallVerificationDecisionSummaryTemplateComponent {
  readonly data = input.required<AerVerificationDecision>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({ change: true });

  readonly wizardStep = OverallVerificationDecisionStep;
  readonly map = overallVerificationDecisionMap;
}
