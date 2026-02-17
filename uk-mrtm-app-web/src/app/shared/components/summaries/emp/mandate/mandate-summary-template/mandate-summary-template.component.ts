import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { EmpMandate, EmpOperatorDetails } from '@mrtm/api';

import { LinkDirective } from '@netz/govuk-components';

import { MandateRegisteredOwnersListSummaryTemplateComponent } from '@shared/components/summaries/emp/mandate/mandate-registered-owners-list-summary-template';
import { MandateResponsibilityDeclarationSummaryTemplateComponent } from '@shared/components/summaries/emp/mandate/mandate-responsibility-declaration-summary-template';
import { MandateResponsibilitySummaryTemplateComponent } from '@shared/components/summaries/emp/mandate/mandate-responsibility-summary-template';
import { SubTaskListMap } from '@shared/types';

@Component({
  selector: 'mrtm-mandate-summary-template',
  imports: [
    LinkDirective,
    MandateRegisteredOwnersListSummaryTemplateComponent,
    MandateResponsibilityDeclarationSummaryTemplateComponent,
    MandateResponsibilitySummaryTemplateComponent,
    RouterLink,
  ],
  standalone: true,
  templateUrl: './mandate-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MandateSummaryTemplateComponent {
  readonly mandate = input.required<EmpMandate>();
  readonly originalMandate = input<EmpMandate>();
  readonly operatorName = input<EmpOperatorDetails['operatorName']>();
  readonly originalOperatorName = input<EmpOperatorDetails['operatorName']>();
  readonly mandateMap = input.required<SubTaskListMap<EmpMandate>>();
  readonly wizardStep = input<{ [s: string]: string }>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({});
}
