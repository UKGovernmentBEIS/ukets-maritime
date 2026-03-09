import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { map, Observable } from 'rxjs';

import { NotificationTemplateDTO } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import {
  LinkDirective,
  NotificationBannerComponent,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { EmailTemplateDetailsTemplateComponent } from '@templates/email/email-template-details-template.component';

@Component({
  selector: 'mrtm-email-template-overview',
  templateUrl: './email-template-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    EmailTemplateDetailsTemplateComponent,
    LinkDirective,
    PageHeadingComponent,
    RouterLink,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowValueDirective,
    SummaryListRowKeyDirective,
    SummaryListRowActionsDirective,
    NotificationBannerComponent,
  ],
})
export class EmailTemplateOverviewComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  notification = this.router.getCurrentNavigation()?.extras.state?.notification;
  emailTemplate$: Observable<NotificationTemplateDTO> = this.route.data.pipe(map(({ emailTemplate }) => emailTemplate));
}
