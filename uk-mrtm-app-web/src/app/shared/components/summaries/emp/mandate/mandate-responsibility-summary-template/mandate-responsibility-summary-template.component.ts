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
  standalone: true,
  templateUrl: './mandate-responsibility-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MandateResponsibilitySummaryTemplateComponent {
  readonly mandate: InputSignal<EmpMandate> = input.required<EmpMandate>();
  readonly originalMandate: InputSignal<EmpMandate> = input<EmpMandate>();
  readonly isEditable: InputSignal<boolean> = input<boolean>(false);
  readonly queryParams: InputSignal<Params> = input<Params>();
  readonly wizardStep: InputSignal<Record<string, string>> = input<Record<string, string>>();
}
