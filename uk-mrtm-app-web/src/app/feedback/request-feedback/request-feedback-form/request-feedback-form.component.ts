import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EMPTY, Observable, switchMap } from 'rxjs';

import { RequestFeedbackAPIService } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import {
  BusinessError,
  BusinessErrorService,
  catchBadRequest,
  catchElseRethrow,
  dashboardLink,
  ErrorCodes,
  HttpStatuses,
} from '@netz/common/error';
import {
  ButtonDirective,
  CheckboxComponent,
  CheckboxesComponent,
  ConditionalContentDirective,
  ErrorSummaryComponent,
  GovukValidators,
  RadioComponent,
  RadioOptionComponent,
  TextareaComponent,
} from '@netz/govuk-components';

import { FeedbackReviewGroupsComponent } from '@feedback/request-feedback/feedback-review-groups';
import {
  EASE_RATING_OPTIONS,
  FeedbackCompletionMethod,
  FeedbackEaseRating,
  feedbackNotAvailableError,
  FeedbackReviewGroup,
  isRequestFeedbackType,
  NO_FEEDBACK_REVIEW_GROUP,
  OTHER_COMPLETION_METHOD,
  REQUEST_FEEDBACK_CONFIG,
  RequestFeedbackConfig,
  RequestFeedbackFormPayload,
  RequestFeedbackType,
} from '@feedback/request-feedback/request-feedback.config';
import { ServiceFeedbackLinkService } from '@shared/services';

const MAX_TEXT_LENGTH = 10000;

const feedbackExpiredError = () => new BusinessError('This feedback form has expired').withLink(dashboardLink);
const feedbackAlreadySubmittedError = (config: RequestFeedbackConfig) =>
  new BusinessError(config.alreadySubmittedMessage).withLink(dashboardLink);

@Component({
  selector: 'mrtm-request-feedback-form',
  imports: [
    ReactiveFormsModule,
    PageHeadingComponent,
    PendingButtonDirective,
    ButtonDirective,
    CheckboxComponent,
    CheckboxesComponent,
    ConditionalContentDirective,
    ErrorSummaryComponent,
    FeedbackReviewGroupsComponent,
    RadioComponent,
    RadioOptionComponent,
    TextareaComponent,
  ],
  standalone: true,
  templateUrl: './request-feedback-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestFeedbackFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly requestFeedbackService = inject(RequestFeedbackAPIService);
  private readonly businessErrorService = inject(BusinessErrorService);
  private readonly serviceFeedbackLinkService = inject(ServiceFeedbackLinkService);

  private readonly requestId: string = this.route.snapshot.queryParamMap.get('requestId');
  private readonly type: RequestFeedbackType | null = isRequestFeedbackType(
    this.route.snapshot.queryParamMap.get('type'),
  )
    ? (this.route.snapshot.queryParamMap.get('type') as RequestFeedbackType)
    : null;

  readonly config: RequestFeedbackConfig | null = this.type ? REQUEST_FEEDBACK_CONFIG[this.type] : null;
  private readonly errorMessages: RequestFeedbackConfig['errorMessages'] = this.config?.errorMessages ?? {
    easeRating: '',
    completionMethods: '',
    otherCompletionMethods: '',
  };
  readonly easeRatingOptions = EASE_RATING_OPTIONS;
  readonly otherCompletionMethod = OTHER_COMPLETION_METHOD;

  readonly isFormAvailable = signal(false);
  readonly isErrorSummaryDisplayed = signal(false);
  readonly isReviewGroupsCommentVisible = signal(false);

  readonly form = this.fb.group({
    easeRating: this.fb.control<FeedbackEaseRating>(null, {
      validators: GovukValidators.required(this.errorMessages.easeRating),
      updateOn: 'change',
    }),
    reportCompletionMethods: this.fb.control<FeedbackCompletionMethod[]>([], {
      validators: GovukValidators.required(this.errorMessages.completionMethods),
      updateOn: 'change',
    }),
    otherReportCompletionMethods: this.fb.control<string>({ value: null, disabled: true }, [
      GovukValidators.required(this.errorMessages.otherCompletionMethods),
      GovukValidators.maxLength(MAX_TEXT_LENGTH, `Enter up to ${MAX_TEXT_LENGTH} characters`),
    ]),
    feedbackReviewGroups: this.fb.control<FeedbackReviewGroup[]>([], {
      validators: GovukValidators.required(
        "Select the sections you want to give feedback on, or select 'No, I do not want to give feedback on any of these sections'",
      ),
      updateOn: 'change',
    }),
    feedbackReviewGroupsComment: this.fb.control<string>({ value: null, disabled: true }, [
      GovukValidators.required('Enter your feedback'),
      GovukValidators.maxLength(MAX_TEXT_LENGTH, `Enter up to ${MAX_TEXT_LENGTH} characters`),
    ]),
    additionalComments: this.fb.control<string>(null, [
      GovukValidators.maxLength(MAX_TEXT_LENGTH, `Enter up to ${MAX_TEXT_LENGTH} characters`),
    ]),
  });

  ngOnInit(): void {
    this.serviceFeedbackLinkService.hideUntilDestroyed(this.destroyRef);

    if (!this.config || !this.requestId) {
      this.businessErrorService.showError(feedbackNotAvailableError()).subscribe();
      return;
    }

    this.requestFeedbackService
      .getRequestFeedbackDetails(this.requestId, this.type)
      .pipe(this.catchFeedbackErrors())
      .subscribe((details) => {
        if (details.expired) {
          this.businessErrorService.showError(feedbackExpiredError()).subscribe();
        } else if (details.status === 'SUBMITTED') {
          this.businessErrorService.showError(feedbackAlreadySubmittedError(this.config)).subscribe();
        } else {
          this.isFormAvailable.set(true);
        }
      });

    this.toggleReviewGroupsComment();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.isErrorSummaryDisplayed.set(true);
      return;
    }

    this.requestFeedbackService
      .submitRequestFeedback(this.requestId, this.type, this.buildPayload())
      .pipe(this.catchFeedbackErrors())
      .subscribe(() => this.router.navigate(['sent'], { relativeTo: this.route }));
  }

  private toggleReviewGroupsComment(): void {
    const comment = this.form.controls.feedbackReviewGroupsComment;

    this.form.controls.feedbackReviewGroups.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((groups) => {
        const isVisible = (groups ?? []).some((group) => group !== NO_FEEDBACK_REVIEW_GROUP);

        this.isReviewGroupsCommentVisible.set(isVisible);
        if (isVisible) {
          comment.enable();
        } else {
          comment.disable();
        }
      });
  }

  private buildPayload(): RequestFeedbackFormPayload {
    const value = this.form.value;

    return {
      payloadType: this.config.payloadType,
      [this.config.easeRatingField]: value.easeRating,
      reportCompletionMethods: value.reportCompletionMethods,
      otherReportCompletionMethods: value.otherReportCompletionMethods ?? null,
      feedbackReviewGroups: value.feedbackReviewGroups,
      feedbackReviewGroupsComment: value.feedbackReviewGroupsComment ?? null,
      additionalComments: value.additionalComments || null,
    } as unknown as RequestFeedbackFormPayload;
  }

  private catchFeedbackErrors<T>() {
    const showError = (error: BusinessError) => this.businessErrorService.showError(error).pipe(switchMap(() => EMPTY));

    return (source: Observable<T>): Observable<T> =>
      source.pipe(
        catchBadRequest(ErrorCodes.REQUESTFEEDBACK1000, () => showError(feedbackExpiredError())),
        catchBadRequest(ErrorCodes.REQUESTFEEDBACK1001, () => showError(feedbackAlreadySubmittedError(this.config))),
        catchElseRethrow(
          (res) => res.status === HttpStatuses.NotFound,
          () => showError(feedbackNotAvailableError()),
        ),
      );
  }
}
