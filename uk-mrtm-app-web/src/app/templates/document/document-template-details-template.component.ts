import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { DocumentTemplateDTO } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

@Component({
  selector: 'mrtm-document-template-details-template',
  imports: [
    LinkDirective,
    RouterLink,
    SummaryListComponent,
    SummaryListRowValueDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    GovukDatePipe,
  ],
  standalone: true,
  templateUrl: './document-template-details-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentTemplateDetailsTemplateComponent {
  private readonly router = inject(Router);

  readonly documentTemplate = input<DocumentTemplateDTO>();

  navigateToEmailTemplate(id: number): void {
    this.router.navigateByUrl(`templates/email/${id}`);
  }
}
