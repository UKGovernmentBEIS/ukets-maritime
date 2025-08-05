import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { GovukDatePipe } from '@netz/common/pipes';
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
import { EmpReviewDecisionTypePipe, UserInfoResolverPipe } from '@shared/pipes';
import { NotificationCompleted } from '@shared/types/notification-completed.interface';

@Component({
  selector: 'mrtm-notification-completed-summary-template',
  standalone: true,
  imports: [
    GovukDatePipe,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    LinkDirective,
    SummaryListRowActionsDirective,
    RouterLink,
    NotProvidedDirective,
    EmpReviewDecisionTypePipe,
    UserInfoResolverPipe,
    SummaryDownloadFilesComponent,
  ],
  templateUrl: './notification-completed-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationCompletedSummaryTemplateComponent {
  notificationCompleted = input.required<NotificationCompleted>();
  changeLink = input<string>();
  isEditable = input<boolean>(false);
  queryParams = input<Params>({});
  recipientIds = computed(() =>
    Object.keys(this.notificationCompleted().usersInfo).filter(
      (userId) => userId !== this.notificationCompleted().signatory,
    ),
  );
}
