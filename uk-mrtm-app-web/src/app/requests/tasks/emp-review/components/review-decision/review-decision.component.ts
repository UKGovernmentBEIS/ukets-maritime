import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import {
  ButtonDirective,
  ConditionalContentDirective,
  FieldsetDirective,
  LegendDirective,
  RadioComponent,
  RadioOptionComponent,
  TextareaComponent,
} from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import { createAnotherRequiredChange } from '@requests/tasks/emp-review/components/review-decision/review-decision.form-provider';
import { REVIEW_DECISION_FORM } from '@requests/tasks/emp-review/components/review-decision/review-decision-form.token';
import { ReviewDecisionFormModel } from '@requests/tasks/emp-review/components/review-decision/review-decision-form-model.type';
import { MultipleFileInputComponent } from '@shared/components';
import { existingControlContainer } from '@shared/providers';
import { RequestTaskFileService } from '@shared/services';

@Component({
  selector: 'mrtm-review-decision',
  standalone: true,
  imports: [
    ButtonDirective,
    ReactiveFormsModule,
    RadioComponent,
    RadioOptionComponent,
    TextareaComponent,
    MultipleFileInputComponent,
    LegendDirective,
    FieldsetDirective,
    ConditionalContentDirective,
  ],
  templateUrl: './review-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [existingControlContainer],
})
export class ReviewDecisionComponent {
  protected readonly form: ReviewDecisionFormModel = inject(REVIEW_DECISION_FORM);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly requestTaskFileService: RequestTaskFileService = inject(RequestTaskFileService);

  downloadUrl = this.store.select(empCommonQuery.selectTasksDownloadUrl)();

  get requiredChangesCtrl() {
    return this.form.controls.requiredChanges;
  }

  addOtherRequiredChange(): void {
    this.requiredChangesCtrl.push(createAnotherRequiredChange(this.store, this.requestTaskFileService));
  }
}
