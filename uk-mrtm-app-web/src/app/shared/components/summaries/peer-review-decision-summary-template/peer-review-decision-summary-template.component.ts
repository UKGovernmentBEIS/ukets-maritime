import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { PeerReviewDecision } from '@mrtm/api';

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
import { PeerReviewDecisionTimelineTextMap } from '@shared/types';

@Component({
  selector: 'mrtm-peer-review-decision-summary-template',
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    LinkDirective,
    RouterLink,
    NotProvidedDirective,
    PeerReviewDecisionPipe,
  ],
  standalone: true,
  templateUrl: './peer-review-decision-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeerReviewDecisionSummaryTemplateComponent {
  readonly decision = input.required<PeerReviewDecision>();
  readonly peerReviewer = input.required<string>();
  readonly map = input.required<PeerReviewDecisionTimelineTextMap>();
  readonly changeLink = input<string>();
  readonly isEditable = input(false);
  readonly queryParams = input<Params>({});
}
