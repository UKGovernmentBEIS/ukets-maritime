import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
  standalone: true,
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
  templateUrl: './overall-decision-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverallDecisionSummaryTemplateComponent {
  @Input({ required: true }) determination: EmpIssuanceDetermination | EmpVariationDetermination;
  @Input() wizardStep: { [s: string]: string };
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
}
