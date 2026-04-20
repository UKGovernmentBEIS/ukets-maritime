import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { RfiResponseSubmitRequestTaskActionPayload } from '@mrtm/api';

import { AuthStore, selectUserId } from '@netz/common/auth';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { TextareaComponent } from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import { rfiRespondQuery } from '@requests/common/emp/request-for-information/+state';
import { requestForInformationRespondFormProvider } from '@requests/common/emp/request-for-information/request-for-information-respond-form/request-for-information-respond-form.provider';
import { RequestForInformationApiService } from '@requests/common/emp/request-for-information/services';
import { TASK_FORM } from '@requests/common/task-form.token';
import { MultipleFileInputComponent, SummaryDownloadFilesComponent, WizardStepComponent } from '@shared/components';
import { AttachedFile, UploadedFile } from '@shared/types';

@Component({
  selector: 'mrtm-request-for-information-respond-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    WizardStepComponent,
    MultipleFileInputComponent,
    TextareaComponent,
    SummaryDownloadFilesComponent,
  ],
  providers: [requestForInformationRespondFormProvider],
  templateUrl: './request-for-information-respond-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestForInformationRespondFormComponent {
  protected readonly formGroup = inject(TASK_FORM);
  private readonly taskStore = inject(RequestTaskStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly rfiService = inject(RequestForInformationApiService);
  private readonly authStore = inject(AuthStore);
  private readonly requestTaskStore: RequestTaskStore = inject(RequestTaskStore);

  public readonly downloadUrl = this.taskStore.select(empCommonQuery.selectTasksDownloadUrl)();
  public readonly questions = this.taskStore.select(rfiRespondQuery.selectQuestion)();
  public readonly canBeDisplayed =
    this.authStore.select(selectUserId)() === this.requestTaskStore.select(requestTaskQuery.selectAssigneeUserId)();

  questionFiles = computed(() => {
    const attachments = this.taskStore.select(rfiRespondQuery.selectAttachments)();
    const questionFiles = this.taskStore.select(rfiRespondQuery.selectQuestion)()?.files;

    if (!questionFiles?.length) {
      return undefined;
    }

    return questionFiles.map(
      (file: string) =>
        ({
          fileName: attachments[file],
          downloadUrl: `${this.downloadUrl}${file}`,
        }) as AttachedFile,
    );
  });

  get answersCtrl(): FormArray {
    return this.formGroup.get('answers') as FormArray;
  }

  onSubmit(): void {
    const payload: RfiResponseSubmitRequestTaskActionPayload = {
      rfiResponsePayload: {
        answers: this.formGroup.get('answers').value,
        files: (this.formGroup.get('files').value ?? []).map((file: string | UploadedFile) =>
          typeof file === 'string' ? file : file?.uuid,
        ),
      },
    };

    this.rfiService.submit(payload).subscribe(() => {
      this.router.navigate(['rfi', 'respond', 'success'], {
        relativeTo: this.route,
        state: {
          responded: true,
        },
      });
    });
  }
}
