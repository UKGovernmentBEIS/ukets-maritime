import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { FeedbackBannerComponent, PageHeadingComponent } from '@netz/common/components';
import { ButtonDirective, TabLazyDirective, TabsComponent } from '@netz/govuk-components';

import { CustomReportsListComponent } from '@mi-reports/custom-reports';
import { CustomReportsPermissionsService } from '@mi-reports/custom-reports/custom-reports-permissions.service';
import { MiReportsComponent } from '@mi-reports/mi-reports.component';
@Component({
  selector: 'mrtm-mi-reports-container',
  imports: [
    FeedbackBannerComponent,
    PageHeadingComponent,
    ButtonDirective,
    TabsComponent,
    TabLazyDirective,
    MiReportsComponent,
    CustomReportsListComponent,
    RouterLink,
  ],
  templateUrl: './mi-reports-container.component.html',
})
export class MiReportsContainerComponent {
  readonly canAddMiReport = toSignal(inject(CustomReportsPermissionsService).canManageCustomReports(), {
    initialValue: false,
  });
}
