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
import { ReviewDecisionTypePipe, UserInfoResolverPipe } from '@shared/pipes';
import { NotificationCompleted } from '@shared/types/notification-completed.interface';

@Component({
  selector: 'mrtm-notification-completed-summary-template',
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
    ReviewDecisionTypePipe,
    UserInfoResolverPipe,
    SummaryDownloadFilesComponent,
  ],
  standalone: true,
  templateUrl: './notification-completed-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationCompletedSummaryTemplateComponent {
  readonly notificationCompleted = input.required<NotificationCompleted>();
  readonly changeLink = input<string>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({});
  readonly recipientIds = computed(() =>
    Object.keys(this.notificationCompleted().usersInfo).filter(
      (userId) => userId !== this.notificationCompleted().signatory,
    ),
  );
}
