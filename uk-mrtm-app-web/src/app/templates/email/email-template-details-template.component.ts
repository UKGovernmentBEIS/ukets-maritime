import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { NotificationTemplateDTO } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

@Component({
  selector: 'mrtm-email-template-details-template',
  imports: [
    GovukDatePipe,
    RouterLink,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    LinkDirective,
  ],
  standalone: true,
  templateUrl: './email-template-details-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailTemplateDetailsTemplateComponent {
  private readonly router = inject(Router);

  readonly emailTemplate = input<NotificationTemplateDTO>();

  navigateToDocumentTemplate(id: number): void {
    this.router.navigateByUrl(`templates/document/${id}`);
  }
}
