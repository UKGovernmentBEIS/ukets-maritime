import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { AerSmf } from '@mrtm/api';

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
  selector: 'mrtm-reduction-claim-summary-template',
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    NotProvidedDirective,
    BooleanToTextPipe,
    RouterLink,
    LinkDirective,
    SummaryListRowActionsDirective,
  ],
  standalone: true,
  templateUrl: './reduction-claim-summary-template.component.html',
  styleUrl: './reduction-claim-summary-template.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReductionClaimSummaryTemplateComponent {
  public readonly data: InputSignal<AerSmf> = input<AerSmf>();
  public readonly header: InputSignal<string> = input<string>();
  public readonly editable: InputSignal<boolean> = input<boolean>(false);
  public readonly wizardStep: InputSignal<Record<string, string>> = input<Record<string, string>>();
  public readonly queryParams: InputSignal<Params> = input<Params>({ change: true });
}
