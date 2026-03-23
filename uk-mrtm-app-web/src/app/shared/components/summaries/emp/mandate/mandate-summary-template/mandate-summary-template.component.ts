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
  standalone: true,
  imports: [
    LinkDirective,
    MandateRegisteredOwnersListSummaryTemplateComponent,
    MandateResponsibilityDeclarationSummaryTemplateComponent,
    MandateResponsibilitySummaryTemplateComponent,
    RouterLink,
  ],
  templateUrl: './mandate-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MandateSummaryTemplateComponent {
  mandate = input.required<EmpMandate>();
  originalMandate = input<EmpMandate>();
  operatorName = input<EmpOperatorDetails['operatorName']>();
  originalOperatorName = input<EmpOperatorDetails['operatorName']>();
  mandateMap = input.required<SubTaskListMap<EmpMandate>>();
  wizardStep = input<{ [s: string]: string }>();
  isEditable = input<boolean>(false);
  queryParams = input<Params>({});
}
