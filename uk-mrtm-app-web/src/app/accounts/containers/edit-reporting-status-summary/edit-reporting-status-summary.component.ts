import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { PageHeadingComponent } from '@netz/common/components';
import {
  ButtonDirective,
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
  WarningTextComponent,
} from '@netz/govuk-components';

import { AccountReportingStatusPipe } from '@accounts/pipes';
import { OperatorAccountsStore, selectReportingStatus } from '@accounts/store';
import { NotificationBannerStore } from '@shared/components/notification-banner';

@Component({
  selector: 'mrtm-edit-reporting-status-summary',
  imports: [
    ButtonDirective,
    PageHeadingComponent,
    RouterLink,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    LinkDirective,
    AccountReportingStatusPipe,
    WarningTextComponent,
  ],
  standalone: true,
  templateUrl: './edit-reporting-status-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditReportingStatusSummaryComponent {
  private readonly router: Router = inject(Router);
  private readonly operatorAccountsStore: OperatorAccountsStore = inject(OperatorAccountsStore);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly notificationBannerStore = inject(NotificationBannerStore);

  readonly reportingYear = input.required<string>();
  readonly currentState = toSignal(this.operatorAccountsStore.pipe(selectReportingStatus));

  onContinue(): void {
    this.operatorAccountsStore
      .submitReportingStatus(this.reportingYear(), this.currentState().upsertStatus)
      .pipe(take(1))
      .subscribe(() => {
        this.router
          .navigate(['../../../'], { relativeTo: this.activatedRoute })
          .then(() => this.notificationBannerStore.setSuccessMessages(['Reporting status updated']));
      });
  }
}
