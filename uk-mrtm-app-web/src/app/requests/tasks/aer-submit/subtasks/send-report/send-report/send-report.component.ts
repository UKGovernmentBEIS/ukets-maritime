import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { of, take } from 'rxjs';

import { AccountVerificationBodyService, VerificationBodyNameInfoDTO } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { catchElseRethrow, HttpStatuses } from '@netz/common/error';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerCommonService } from '@requests/common/aer/services';
import { aerSubmitQuery } from '@requests/tasks/aer-submit/+state';
import { SendReportSuccessStore } from '@requests/tasks/aer-submit/subtasks/send-report/send-report-success-message/+state/send-report-success-store.service';
import { CompetentAuthorityPipe } from '@shared/pipes';
import { isNil } from '@shared/utils';

@Component({
  selector: 'mrtm-send-report',
  imports: [
    NgTemplateOutlet,
    ButtonDirective,
    PageHeadingComponent,
    PendingButtonDirective,
    ReturnToTaskOrActionPageComponent,
    CompetentAuthorityPipe,
    RouterLink,
    LinkDirective,
  ],
  standalone: true,
  templateUrl: './send-report.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendReportComponent {
  private readonly service = inject(TaskService<AerSubmitTaskPayload>);
  private readonly store = inject(RequestTaskStore);
  private readonly accountVerificationBodyService = inject(AccountVerificationBodyService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly sendReportSuccessStore = inject(SendReportSuccessStore);

  readonly accountId = this.store.select(requestTaskQuery.selectRequestTaskAccountId);
  readonly competentAuthority = this.store.select(requestTaskQuery.selectRequestTaskCompetentAuthority);
  readonly shouldSendToRegulator = this.store.select(aerSubmitQuery.selectShouldSubmitToRegulator);
  readonly hasVerificationBody: WritableSignal<boolean> = signal(null);
  readonly verificationBody: WritableSignal<VerificationBodyNameInfoDTO> = signal(null);

  constructor() {
    effect(() => {
      if (this.shouldSendToRegulator()) {
        this.hasVerificationBody.set(null);
        this.verificationBody.set(null);
      } else if (!isNil(this.accountId())) {
        this.accountVerificationBodyService
          .getVerificationBodyOfAccount(this.accountId())
          .pipe(
            catchElseRethrow(
              (error) => error.status === HttpStatuses.NotFound,
              () => of(null),
            ),
            take(1),
          )
          .subscribe((verificationBody) => {
            this.hasVerificationBody.set(!!verificationBody);
            this.verificationBody.set(verificationBody);
          });
      }
    });
  }

  onSubmit() {
    const submission$ = this.shouldSendToRegulator()
      ? this.service.submit()
      : (this.service as AerCommonService).submitForVerification();
    this.sendReportSuccessStore.setVerificationBodyNameInfo(this.verificationBody());
    submission$.subscribe(() => {
      this.router.navigate(['success'], { relativeTo: this.route, skipLocationChange: true });
    });
  }
}
