import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { EmpMandate, EmpOperatorDetails } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { HtmlDiffDirective } from '@shared/directives';
import { ResponsibilityDeclarationPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-mandate-responsibility-declaration-summary-template',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    LinkDirective,
    RouterLink,
    HtmlDiffDirective,
    ResponsibilityDeclarationPipe,
  ],
  templateUrl: './mandate-responsibility-declaration-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MandateResponsibilityDeclarationSummaryTemplateComponent {
  readonly mandate: InputSignal<EmpMandate> = input<EmpMandate>();
  readonly originalMandate: InputSignal<EmpMandate> = input<EmpMandate>();
  operatorName = input<EmpOperatorDetails['operatorName']>();
  originalOperatorName = input<EmpOperatorDetails['operatorName']>();
  readonly isEditable: InputSignal<boolean> = input<boolean>(false);
  readonly queryParams: InputSignal<Params> = input<Params>();
  readonly wizardStep: InputSignal<Record<string, string>> = input<Record<string, string>>();
}
