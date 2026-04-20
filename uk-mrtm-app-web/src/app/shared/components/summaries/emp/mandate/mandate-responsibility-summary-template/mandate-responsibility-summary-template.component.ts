import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { EmpMandate } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { HtmlDiffDirective } from '@shared/directives';
import { BooleanToTextPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-mandate-responsibility-summary-template',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    LinkDirective,
    BooleanToTextPipe,
    RouterLink,
    HtmlDiffDirective,
  ],
  templateUrl: './mandate-responsibility-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MandateResponsibilitySummaryTemplateComponent {
  mandate: InputSignal<EmpMandate> = input.required<EmpMandate>();
  originalMandate: InputSignal<EmpMandate> = input<EmpMandate>();
  isEditable: InputSignal<boolean> = input<boolean>(false);
  queryParams: InputSignal<Params> = input<Params>();
  wizardStep: InputSignal<Record<string, string>> = input<Record<string, string>>();
}
