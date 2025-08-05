import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { NotificationTemplateDTO } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import { GovukComponentsModule } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-email-template-details-template',
  templateUrl: './email-template-details-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [GovukComponentsModule, GovukDatePipe, RouterLink],
})
export class EmailTemplateDetailsTemplateComponent {
  private readonly router = inject(Router);

  @Input() emailTemplate: NotificationTemplateDTO;

  navigateToDocumentTemplate(id: number): void {
    this.router.navigateByUrl(`templates/document/${id}`);
  }
}
