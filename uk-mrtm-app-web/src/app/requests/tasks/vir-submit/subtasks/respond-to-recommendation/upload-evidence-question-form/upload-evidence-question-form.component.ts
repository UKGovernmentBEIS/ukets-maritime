import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { take } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { RadioComponent, RadioOptionComponent } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import { RESPOND_TO_RECOMMENDATION_SUBTASK, virSubtaskList } from '@requests/common/vir';
import { virCommonQuery } from '@requests/common/vir/+state';
import { VirRespondToRecommendationWizardStep } from '@requests/tasks/vir-submit/subtasks/respond-to-recommendation';
import { uploadEvidenceQuestionFormProvider } from '@requests/tasks/vir-submit/subtasks/respond-to-recommendation/upload-evidence-question-form/upload-evidence-question-form.provider';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-upload-evidence-question-form',
  imports: [WizardStepComponent, ReactiveFormsModule, RadioComponent, RadioOptionComponent],
  standalone: true,
  templateUrl: './upload-evidence-question-form.component.html',
  providers: [uploadEvidenceQuestionFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadEvidenceQuestionFormComponent {
  private readonly store = inject(RequestTaskStore);
  private readonly service = inject(TaskService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public readonly formGroup = inject(TASK_FORM);
  public readonly key = input<string>();

  public readonly caption = computed(() => {
    const { verificationDataKey, reference } =
      this.store.select(virCommonQuery.selectVirVerifierRecommendationDataByKey(this.key()))() ?? {};

    return `${reference}: ${virSubtaskList[verificationDataKey]?.title}`;
  });

  public onSubmit(): void {
    this.service
      .saveSubtask(
        RESPOND_TO_RECOMMENDATION_SUBTASK,
        VirRespondToRecommendationWizardStep.UPLOAD_EVIDENCE_QUESTION,
        this.activatedRoute,
        this.formGroup.value,
      )
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(
          [
            !this.formGroup.value.uploadEvidence
              ? VirRespondToRecommendationWizardStep.SUMMARY
              : `../${VirRespondToRecommendationWizardStep.UPLOAD_EVIDENCE_FORM}`,
          ],
          { relativeTo: this.activatedRoute },
        );
      });
  }
}
