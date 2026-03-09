import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
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
  templateUrl: './document-template-details-template.component.html',
  standalone: true,
  imports: [
    LinkDirective,
    RouterLink,
    SummaryListComponent,
    SummaryListRowValueDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    GovukDatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentTemplateDetailsTemplateComponent {
  private readonly router = inject(Router);

  @Input() documentTemplate: DocumentTemplateDTO;

  navigateToEmailTemplate(id: number): void {
    this.router.navigateByUrl(`templates/email/${id}`);
  }
}
