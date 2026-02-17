import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { NotificationTemplateDTO } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import { GovukComponentsModule } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-email-template-details-template',
  imports: [GovukComponentsModule, GovukDatePipe, RouterLink],
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
