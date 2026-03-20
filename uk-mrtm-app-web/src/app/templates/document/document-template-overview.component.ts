import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { map, Observable } from 'rxjs';

import { DocumentTemplateDTO } from '@mrtm/api';

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

import { DocumentTemplateDetailsTemplateComponent } from '@templates/document/document-template-details-template.component';

@Component({
  selector: 'mrtm-document-template-overview',
  imports: [
    AsyncPipe,
    LinkDirective,
    NotificationBannerComponent,
    PageHeadingComponent,
    RouterLink,
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    DocumentTemplateDetailsTemplateComponent,
  ],
  standalone: true,
  templateUrl: './document-template-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentTemplateOverviewComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  notification = this.router.currentNavigation()?.extras.state?.notification;
  documentTemplate$: Observable<DocumentTemplateDTO> = this.route.data.pipe(map((data) => data?.documentTemplate));
}
