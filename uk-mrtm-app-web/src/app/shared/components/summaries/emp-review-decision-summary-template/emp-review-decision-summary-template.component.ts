import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { EmpIssuanceReviewDecision, EmpVariationReviewDecision } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components';
import { NotProvidedDirective } from '@shared/directives';
import { EmpReviewDecisionTypePipe } from '@shared/pipes';
import { EmpReviewDecisionDtoBase } from '@shared/types';

@Component({
  selector: 'mrtm-emp-review-decision-summary-template',
  standalone: true,
  imports: [
    LinkDirective,
    SummaryDownloadFilesComponent,
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    RouterLink,
    NotProvidedDirective,
    EmpReviewDecisionTypePipe,
  ],
  templateUrl: './emp-review-decision-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpReviewDecisionSummaryTemplateComponent {
  @Input({ required: true }) reviewDecision: EmpReviewDecisionDtoBase<
    EmpVariationReviewDecision['type'] | EmpIssuanceReviewDecision['type']
  >;
  @Input() changeLink: string;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
}
