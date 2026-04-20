import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
  standalone: true,
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
  templateUrl: './peer-review-decision-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeerReviewDecisionSummaryTemplateComponent {
  @Input({ required: true }) decision: PeerReviewDecision;
  @Input({ required: true }) peerReviewer: string;
  @Input({ required: true }) map: PeerReviewDecisionTimelineTextMap;
  @Input() changeLink: string;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
}
