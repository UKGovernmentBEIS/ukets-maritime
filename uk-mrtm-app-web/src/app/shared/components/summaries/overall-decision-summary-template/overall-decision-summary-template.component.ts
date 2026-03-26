import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { EmpIssuanceDetermination, EmpVariationDetermination } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { NotProvidedDirective } from '@shared/directives';
import { DeterminationTypePipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-overall-decision-summary-template',
  imports: [
    LinkDirective,
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    NotProvidedDirective,
    RouterLink,
    DeterminationTypePipe,
  ],
  standalone: true,
  templateUrl: './overall-decision-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverallDecisionSummaryTemplateComponent {
  readonly determination = input.required<EmpIssuanceDetermination | EmpVariationDetermination>();
  readonly wizardStep = input<{
    [s: string]: string;
  }>();
  readonly isEditable = input(false);
  readonly queryParams = input<Params>({});
}
