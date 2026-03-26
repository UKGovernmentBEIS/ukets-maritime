import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { EmpNotificationDetailsOfChange } from '@mrtm/api';

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
import { AttachedFile } from '@shared/types';

@Component({
  selector: 'mrtm-notification-details-of-change-summary-template',
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
  ],
  standalone: true,
  templateUrl: './notification-details-of-change-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationDetailsOfChangeSummaryTemplateComponent {
  readonly detailsOfChange = input.required<EmpNotificationDetailsOfChange>();
  readonly notificationFiles = input.required<AttachedFile[]>();
  readonly changeLink = input<string>();
  readonly isEditable = input(false);
  readonly queryParams = input<Params>({});
  readonly heading = input('Response details');
}
