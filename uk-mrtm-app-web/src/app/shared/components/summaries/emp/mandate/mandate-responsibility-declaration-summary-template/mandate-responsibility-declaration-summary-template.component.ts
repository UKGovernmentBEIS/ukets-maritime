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

import { NotProvidedDirective } from '@shared/directives';
import { BooleanToTextPipe } from '@shared/pipes';

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
    NotProvidedDirective,
    BooleanToTextPipe,
    RouterLink,
  ],
  templateUrl: './mandate-responsibility-declaration-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MandateResponsibilityDeclarationSummaryTemplateComponent {
  public readonly wizardStepPrefix: InputSignal<string> = input<string>('.');
  public readonly data: InputSignal<Pick<EmpMandate, 'responsibilityDeclaration'>> =
    input<Pick<EmpMandate, 'responsibilityDeclaration'>>();
  public readonly isEditable: InputSignal<boolean> = input<boolean>(false);
  public readonly queryParams: InputSignal<Params> = input<Params>();
  public readonly wizardStep: InputSignal<Record<string, string>> = input<Record<string, string>>();
}
