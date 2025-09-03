import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { DecisionNotification } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { GovukDatePipe } from '@netz/common/pipes';
import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components/summary-download-files/summary-download-files.component';
import { NotProvidedDirective } from '@shared/directives';
import { BooleanToTextPipe, ReviewDecisionTypePipe, UserInfoResolverPipe } from '@shared/pipes';
import { AttachedFile, NotificationReviewDecisionUnion, NotifyAccountOperatorUsersInfo } from '@shared/types';

@Component({
  selector: 'mrtm-notification-decision-summary-template',
  standalone: true,
  imports: [
    GovukDatePipe,
    SummaryDownloadFilesComponent,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    LinkDirective,
    SummaryListRowActionsDirective,
    RouterLink,
    NotProvidedDirective,
    ReviewDecisionTypePipe,
    BooleanToTextPipe,
    UserInfoResolverPipe,
  ],
  templateUrl: './notification-decision-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationDecisionSummaryTemplateComponent implements OnInit {
  @Input({ required: true }) reviewDecision: NotificationReviewDecisionUnion;
  @Input({ required: true }) usersInfo: NotifyAccountOperatorUsersInfo;
  @Input({ required: true }) reviewDecisionNotification: DecisionNotification;
  @Input({ required: true }) officialNotice: AttachedFile;
  @Input() changeLink: string;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
  recipientIds: string[] = [];
  private readonly authStore = inject(AuthStore);

  public readonly userRole = this.authStore.select(selectUserRoleType);

  ngOnInit(): void {
    this.recipientIds = Object.keys(this.usersInfo).filter(
      (userId) => userId !== this.reviewDecisionNotification.signatory,
    );
  }
}
