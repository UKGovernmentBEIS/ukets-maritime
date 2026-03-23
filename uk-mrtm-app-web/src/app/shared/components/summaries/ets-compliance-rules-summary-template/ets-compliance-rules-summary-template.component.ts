import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { AerEtsComplianceRules } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { EtsComplianceRulesStep } from '@requests/common/aer/subtasks/ets-compliance-rules/ets-compliance-rules.helpers';
import { etsComplianceRulesMap } from '@requests/common/aer/subtasks/ets-compliance-rules/ets-compliance-rules-subtask-list.map';
import { NotProvidedDirective } from '@shared/directives';
import { BooleanToTextPipe, YesNoToTextPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-ets-compliance-rules-summary-template',
  standalone: true,
  imports: [
    BooleanToTextPipe,
    LinkDirective,
    RouterLink,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    NotProvidedDirective,
    YesNoToTextPipe,
  ],
  templateUrl: './ets-compliance-rules-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EtsComplianceRulesSummaryTemplateComponent {
  readonly data = input<AerEtsComplianceRules>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({ change: true });

  readonly wizardStep = EtsComplianceRulesStep;
  readonly map = etsComplianceRulesMap;
}
