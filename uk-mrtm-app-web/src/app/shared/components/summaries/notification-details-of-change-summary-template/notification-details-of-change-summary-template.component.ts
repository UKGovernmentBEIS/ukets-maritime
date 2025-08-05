import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
  ],
  templateUrl: './notification-details-of-change-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationDetailsOfChangeSummaryTemplateComponent {
  @Input({ required: true }) detailsOfChange: EmpNotificationDetailsOfChange;
  @Input({ required: true }) notificationFiles: AttachedFile[];
  @Input() changeLink: string;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
  @Input() heading = 'Response details';
}
