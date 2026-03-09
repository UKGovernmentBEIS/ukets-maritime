import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { NotProvidedDirective } from '@shared/directives';
import { PeerReviewDecisionPipe } from '@shared/pipes';
import { EmpPeerReviewDecisionDto } from '@shared/types';

@Component({
  selector: 'mrtm-emp-peer-review-decision-summary-template',
  standalone: true,
  imports: [
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    NotProvidedDirective,
    SummaryListRowActionsDirective,
    RouterLink,
    SummaryListComponent,
    LinkDirective,
    PeerReviewDecisionPipe,
  ],
  templateUrl: './emp-peer-review-decision-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpPeerReviewDecisionSummaryTemplateComponent {
  public readonly data = input.required<EmpPeerReviewDecisionDto>();
  public readonly isEditable = input<boolean>(false);
  public readonly changeLink = input<string>();
  public readonly queryParams = input<Params>();
}
