import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, combineLatest, filter, first, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';

import { NotificationTemplateDTO, NotificationTemplatesService } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import {
  ButtonDirective,
  ErrorSummaryComponent,
  GovukValidators,
  TextareaComponent,
  TextInputComponent,
} from '@netz/govuk-components';

import { EmailTemplateDetailsTemplateComponent } from '@templates/email/email-template-details-template.component';

@Component({
  selector: 'mrtm-email-template',
  templateUrl: './email-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    ButtonDirective,
    EmailTemplateDetailsTemplateComponent,
    ErrorSummaryComponent,
    PageHeadingComponent,
    PendingButtonDirective,
    ReactiveFormsModule,
    TextareaComponent,
    TextInputComponent,
  ],
})
export class EmailTemplateComponent {
  private readonly fb = inject(UntypedFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notificationTemplatesService = inject(NotificationTemplatesService);

  emailTemplate$: Observable<NotificationTemplateDTO> = this.route.data.pipe(map(({ emailTemplate }) => emailTemplate));

  form$ = this.emailTemplate$.pipe(
    map((emailTemplate) =>
      this.fb.group({
        subject: [
          emailTemplate?.subject,
          [
            GovukValidators.required('Enter an email subject'),
            GovukValidators.maxLength(255, 'The email subject should not be more than 255 characters'),
          ],
        ],
        message: [
          emailTemplate?.text,
          [
            GovukValidators.required('Enter an email message'),
            GovukValidators.maxLength(10000, 'The email message should not be more than 10000 characters'),
          ],
        ],
      }),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
  displayErrorSummary$ = new BehaviorSubject<boolean>(false);

  onSubmit(): void {
    combineLatest([this.form$, this.emailTemplate$])
      .pipe(
        first(),
        tap(([form]) => {
          if (!form.valid) {
            this.displayErrorSummary$.next(true);
          }
        }),
        filter(([form]) => form.valid),
        switchMap(([form, emailTemplate]) =>
          form.dirty
            ? this.notificationTemplatesService.updateNotificationTemplate(emailTemplate.id, {
                subject: form.get('subject').value,
                text: form.get('message').value,
              })
            : of(null),
        ),
      )
      .subscribe(() => this.router.navigate(['..'], { relativeTo: this.route, state: { notification: true } }));
  }
}
