import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { MiReportsUserDefinedService } from '@mrtm/api';

import { FeedbackBannerStore, PageHeadingComponent } from '@netz/common/components';
import { PendingRequestService } from '@netz/common/services';
import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-custom-reports-delete',
  imports: [RouterLink, PageHeadingComponent, LinkDirective, ButtonDirective],
  templateUrl: './custom-reports-delete.component.html',
})
export class CustomReportsDeleteComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly service = inject(MiReportsUserDefinedService);
  private readonly feedbackBannerStore = inject(FeedbackBannerStore);
  private readonly pendingRequestService = inject(PendingRequestService);

  public readonly id = input<number>();

  protected onDelete() {
    this.service
      .deleteMiReportUserDefined(this.id())
      .pipe(take(1), this.pendingRequestService.trackRequest())
      .subscribe(() => {
        this.feedbackBannerStore.setSuccessMessages(['The report has been deleted']);
        this.router.navigate(['../../../'], { relativeTo: this.activatedRoute });
      });
  }
}
